import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
       '*'
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  // Set up global pipes BEFORE listening
  app.useGlobalPipes(new ValidationPipe());

  // Set up Swagger BEFORE listening
  const config = new DocumentBuilder()
    .setTitle('Maker Skills API')
    .setDescription('Documentation for the Maker Skills API')
    .setVersion('0.1.0')
    .addBearerAuth() // if you use JWT authentication
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCssUrl: ['https://unpkg.com/swagger-ui-dist/swagger-ui.css'],
    customJs: [
      'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
    ],
  });

  // Listen LAST
  await app.listen(3020, '0.0.0.0');

  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3020}`,
  );
  console.log(
    `Swagger docs available at: http://localhost:${process.env.PORT ?? 3020}/api`,
  );
}
bootstrap();
