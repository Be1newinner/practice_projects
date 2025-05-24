import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  // Use pipes for modification of request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new LoggingInterceptor())

  const config = new DocumentBuilder()
    .setTitle('TODO Nest')
    .setDescription('WE ARE TESTING APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
void bootstrap();

// Incoming request -->
//   [PIPE]     ✅ Clean & validate the request
//   [INTERCEPTOR] 🔁 Wrap logic, log/transform/cache
//   [CONTROLLER]  🎯 Business logic runs
//   [INTERCEPTOR] 🔁 Wrap response, format output
//   [FILTER]   🔥 Catch and respond to any thrown error
// --> Outgoing response
