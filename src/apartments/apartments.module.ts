import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { FileUploadModule } from '../common/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment]), FileUploadModule],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
  exports: [TypeOrmModule],
})
export class ApartmentsModule {}
