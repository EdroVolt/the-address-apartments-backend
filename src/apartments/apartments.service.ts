import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './entities/apartment.entity';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
  ) {}

  findAll(): Promise<Apartment[]> {
    return this.apartmentsRepository.find();
  }

  async findOne(id: number): Promise<Apartment> {
    const apartment = await this.apartmentsRepository.findOneBy({ id });
    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }
    return apartment;
  }

  create(apartment: Partial<Apartment>): Promise<Apartment> {
    const newApartment = this.apartmentsRepository.create(apartment);
    return this.apartmentsRepository.save(newApartment);
  }

  async update(id: number, apartment: Partial<Apartment>): Promise<Apartment> {
    await this.apartmentsRepository.update(id, apartment);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.apartmentsRepository.delete(id);
  }
}
