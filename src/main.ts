import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main');

let amqpUrl = 'amqp://';
amqpUrl += `${process.env.RABBITMQ_USER}:`;
amqpUrl += process.env.RABBITMQ_PASS;
amqpUrl += `@${process.env.RABBITMQ_HOST}`;
amqpUrl += `:${process.env.RABBITMQ_PORT}/smartranking`;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      noAck: false,
      queue: 'admin-backend'
    }
  });

  await app.listen();
}
bootstrap();
