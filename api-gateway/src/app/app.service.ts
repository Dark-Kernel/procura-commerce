import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    return { status: 'API Gateway running' };
  }
}

