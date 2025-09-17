import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'product.create' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'product.findAll' })
  findAll() {
    return this.productService.findAll();
  }

  @MessagePattern({ cmd: 'product.findOne' })
  findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern({ cmd: 'product.update' })
  update(@Payload() payload: { id: string, updateProductDto: Partial<UpdateProductDto> }) {
    return this.productService.update(payload.id, payload.updateProductDto);
  }

  @MessagePattern({ cmd: 'product.updateQuantity' })
  updateQuantity(@Payload() payload: { id: string, updateProductDto: Partial<UpdateProductDto> }) {
    return this.productService.update(payload.id, payload.updateProductDto);
  }

  @MessagePattern({ cmd: 'product.remove' })
  remove(@Payload() id: string) {
    return this.productService.remove(id);
  }
}
