import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function parseCorsOrigins(): string[] | true {
  const raw = process.env.CORS_ORIGINS;
  if (!raw || raw.trim() === '*') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CORS_ORIGINS must be set to an explicit allowlist in production',
      );
    }
    return true;
  }
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigins = parseCorsOrigins();

  app.enableCors({
    origin: corsOrigins === true
      ? true
      : (origin, callback) => {
          if (!origin || (corsOrigins as string[]).includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`), false);
          }
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Maker Skills API')
      .setDescription('Documentation for the Maker Skills API')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customCssUrl: ['https://unpkg.com/swagger-ui-dist/swagger-ui.css'],
      customJs: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
    });
  }

  const port = Number(process.env.PORT) || 3020;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Swagger docs available at: http://localhost:${port}/api`);
  }
}
bootstrap();
