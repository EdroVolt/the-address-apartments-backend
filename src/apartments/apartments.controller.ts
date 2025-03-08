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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadService } from '../common/file-upload/file-upload.service';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../common/constants';
import { ApartmentsService } from './apartments.service';
import { Apartment } from './entities/apartment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('apartments')
export class ApartmentsController {
  constructor(
    private readonly apartmentsService: ApartmentsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(+id);
  }
}
