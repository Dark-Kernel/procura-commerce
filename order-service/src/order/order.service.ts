import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}
  create(createOrderDto: CreateOrderDto) {
    const p = this.repo.create({...createOrderDto, products: createOrderDto.products, customer: createOrderDto.customer, totalAmount: createOrderDto.totalAmount.toFixed(2)});
    return this.repo.save(p);
    // return 'This action adds a new order';
  }

  findAll() {
    return this.repo.find();
    // return `This action returns all order`;
  }

  findOne(id: string) {
    return this.repo.findOne({where: {id}});
    // return `This action returns a #${id} order`;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.repo.update(id, {...updateOrderDto, totalAmount: updateOrderDto.totalAmount.toFixed(2)});
    return this.findOne(id);
    // return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return this.repo.delete(id);
    // return `This action removes a #${id} order`;
  }

}
