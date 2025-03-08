import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { UPLOADS_FOLDER } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable CORS
  app.enableCors();

  // Serve static files from the uploads directory
  app.useStaticAssets(join(process.cwd(), UPLOADS_FOLDER), {
    prefix: `/${UPLOADS_FOLDER}/`,
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
