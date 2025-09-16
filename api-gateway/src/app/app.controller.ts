import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from '../../../product-service/src/product/dto/create-product.dto'; // import path via monorepo
import { CreateOrderDto } from '../../../order-service/src/order/dto/create-order.dto';

import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('PRODUCT_SERVICE') private prodClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @UseGuards(JwtAuthGuard)
  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.create' }, dto));
  }

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async listProducts() {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.findAll' }, {}));
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async createOrder(@Body() dto: CreateOrderDto) {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.create' }, dto));
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async listOrders() {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.findAll' }, {}));
  }
}
