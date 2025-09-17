import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrderModule } from './order/order.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: +(process.env.PORT || 3002),
    },
  });
  await app.listen();
  Logger.log(
    `🚀 Order microservice is running on: http://0.0.0.0:${process.env.PORT}`
  );
}

bootstrap();
