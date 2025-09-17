import { Controller, Get, UseGuards, Post, Body, Delete, Param, Patch, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

import { lastValueFrom } from 'rxjs';

import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, IsOptional, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

// DTOs for Order
class CustomerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;
}

class ProductOrderItemDto {
  @ApiProperty()
  @IsString()
  productCode: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: CustomerDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: [ProductOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemDto)
  products: ProductOrderItemDto[];

  @ApiProperty()
  @IsNumber()
  totalAmount: number;
}

export class UpdateOrderDto {
  @ApiProperty({ type: CustomerDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer?: CustomerDto;

  @ApiProperty({ type: [ProductOrderItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemDto)
  products?: ProductOrderItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}

// DTOs for Product
export class CreateProductDto {
  @ApiProperty()
  @IsString() 
  code: string;

  @ApiProperty()
  @IsString() 
  name: string;

  @ApiProperty({ required: false })
  @IsOptional() 
  @IsString() 
  description?: string;

  @ApiProperty()
  @Type(() => Number) 
  @IsNumber() 
  rate: number;

  @ApiProperty({ required: false })
  @IsOptional() 
  @IsString() 
  image?: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional() 
  @IsString() 
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional() 
  @IsString() 
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional() 
  @IsString() 
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional() 
  @Type(() => Number) 
  @IsNumber() 
  rate?: number;

  @ApiProperty({ required: false })
  @IsOptional() 
  @IsString() 
  image?: string;
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
