import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadService } from '../common/file-upload/file-upload.service';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../common/constants';
import { ApartmentsService } from './apartments.service';
import { Apartment } from './entities/apartment.entity';

@Controller('apartments')
export class ApartmentsController {
  constructor(
    private readonly apartmentsService: ApartmentsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.originalname.split('.').pop()}`;
          cb(null, uniqueFilename);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  create(
    @Body() createApartmentDto: Partial<Apartment>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const fileUrl = this.fileUploadService.getFileUrl(file.filename);
      if (fileUrl !== null) {
        createApartmentDto.imageUrl = fileUrl;
      }
    }
    return this.apartmentsService.create(createApartmentDto);
  }

  @Get()
  findAll() {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.originalname.split('.').pop()}`;
          cb(null, uniqueFilename);
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateApartmentDto: Partial<Apartment>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const fileUrl = this.fileUploadService.getFileUrl(file.filename);
      if (fileUrl !== null) {
        updateApartmentDto.imageUrl = fileUrl;
      }
    }
    return this.apartmentsService.update(+id, updateApartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(+id);
  }
}
