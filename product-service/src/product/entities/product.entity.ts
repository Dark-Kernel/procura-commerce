import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) code: string;
  @Column() name: string;
  @Column('text', { nullable: true }) description?: string;
  @Column('decimal', { precision: 10, scale: 2 }) rate: string;
  @Column({ nullable: true }) image?: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

}
