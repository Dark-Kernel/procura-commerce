import { Controller, Get, UseGuards, Post, Body, Delete, Param, Patch, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

import { lastValueFrom } from 'rxjs';

import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, IsOptional} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsObject()
  @IsNotEmpty()
  customer: {
    name: string;
    phone: string;
  };

  @IsArray()
  @IsNotEmpty()
  products: {
    productCode: string;
    quantity: number;
  }[];

  @IsNumber()
  totalAmount: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsObject()
  customer?: {
    name: string;
    phone: string;
  };

  @IsOptional()
  @IsArray()
  products?: {
    productCode: string;
    quantity: number;
  }[];

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}

export class CreateProductDto {
  @IsString() code: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber() rate: number;
  @IsOptional() @IsString() image?: string;
}

export class UpdateProductDto {
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Number) @IsNumber() rate?: number;
  @IsOptional() @IsString() image?: string;
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('PRODUCT_SERVICE') private prodClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  // Product Routes
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.create' }, dto));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('products')
  async listProducts() {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.findAll' }, {}));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.findOne' }, id));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.update' }, { id, updateProductDto: dto }));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put('products/:id')
  async updateProductQuantity(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.updateQuantity' }, { id, updateProductDto: dto }));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('products/:id')
  async removeProduct(@Param('id') id: string) {
    return lastValueFrom(this.prodClient.send({ cmd: 'product.remove' }, id));
  }

  // Order Routes
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async createOrder(@Body() dto: CreateOrderDto) {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.create' }, dto));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async listOrders() {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.findAll' }, {}));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.findOne' }, id));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('orders/:id')
  async updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.update' }, { id, updateOrderDto: dto }));
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('orders/:id')
  async removeOrder(@Param('id') id: string) {
    return lastValueFrom(this.orderClient.send({ cmd: 'order.remove' }, id));
  }
}
