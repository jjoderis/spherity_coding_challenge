import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // expose an open api schema endpoint on /api during development
  // (this will also expose /api-json which we use to generate client code for interfacing with the api)
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Simple Credential Wallet API')
      .setDescription(
        'This is the api for a simple credential wallet that can be used to issue, store, share, and verify credentials.',
      )
      .setVersion('1.0')
      .build();

    const documentFactory = () => {
      return SwaggerModule.createDocument(app, config, {
        operationIdFactory: (_, methodKey) => {
          return methodKey;
        },
      });
    };

    SwaggerModule.setup('api', app, documentFactory, {});
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
