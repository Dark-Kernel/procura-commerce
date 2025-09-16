import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

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

