import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'pass',
      database: process.env.DB_NAME || 'appdb',
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
