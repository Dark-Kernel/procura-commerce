import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('jsonb') customer: { name: string; phone: string };
  @Column('jsonb') products: { code: string; name?: string; quantity: number; rate: string }[];
  @Column('numeric', { precision: 12, scale: 2 }) totalAmount: string;

  @CreateDateColumn() createdAt: Date;
}

