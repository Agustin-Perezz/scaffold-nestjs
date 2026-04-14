import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AlquilerAutosModule } from './alquiler-autos.module';

async function bootstrap() {
  const app = await NestFactory.create(AlquilerAutosModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Rentadora Autos API')
    .setDescription('API para el sistema de alquiler de autos')
    .setVersion('1.0')
    .addTag('Autos', 'Operaciones relacionadas con autos')
    .addTag('Clientes', 'Operaciones relacionadas con clientes')
    .addTag('Reservas', 'Operaciones relacionadas con reservas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger documentation: http://localhost:3000/api');
}

bootstrap();
