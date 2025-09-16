import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'PRODUCT_SERVICE', transport: Transport.TCP, options: { host: process.env.PRODUCT_HOST || 'product-service', port: +(process.env.PRODUCT_PORT || 3001) } },
      { name: 'ORDER_SERVICE',   transport: Transport.TCP, options: { host: process.env.ORDER_HOST   || 'order-service',   port: +(process.env.ORDER_PORT   || 3002) } },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

