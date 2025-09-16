import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}
  create(createProductDto: CreateProductDto) {
    const p = this.repo.create({...createProductDto, rate: createProductDto.rate.toFixed(2)});
    return this.repo.save(p);
    // return 'This action adds a new product';
  }

  findAll() {
    return this.repo.find();
    // return `This action returns all product`;
  }

  findOne(id: string) {
    return this.repo.findOne({where: {id}});
    // return `This action returns a #${id} product`;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.repo.update(id, {...updateProductDto, rate: updateProductDto.rate? updateProductDto.rate.toFixed(2) : undefined});
    return this.findOne(id);
    // return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return this.repo.delete(id);
    // return `This action removes a #${id} product`;
  }
}
