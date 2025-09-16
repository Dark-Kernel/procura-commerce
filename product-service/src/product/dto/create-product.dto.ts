import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() code: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber() rate: number;
  @IsOptional() @IsString() image?: string;
}

