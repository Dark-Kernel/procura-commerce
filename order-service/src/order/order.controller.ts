import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'order.create' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @MessagePattern({ cmd: 'order.findAll' })
  findAll() {
    return this.orderService.findAll();
  }

  @MessagePattern({ cmd: 'order.findOne' })
  findOne(@Payload() id: string) {
    return this.orderService.findOne(id);
  }

  @MessagePattern({ cmd: 'order.update' })
  update(@Payload() payload: { id: string, updateOrderDto: Partial<UpdateOrderDto> }) {
    return this.orderService.update(payload.id, payload.updateOrderDto);
  }

  @MessagePattern({ cmd: 'order.remove' })
  remove(@Payload() id: string) {
    return this.orderService.remove(id);
  }
}
