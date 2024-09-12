import { Injectable } from '@nestjs/common';
import { CreateRoseDto } from './dto/create-rose.dto';
import { UpdateRoseDto } from './dto/update-rose.dto';
import { RoseRepository } from './infrastructure/persistence/rose.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Rose } from './domain/rose';

@Injectable()
export class RosesService {
  constructor(private readonly roseRepository: RoseRepository) {}

  create(createRoseDto: CreateRoseDto) {
    return this.roseRepository.create(createRoseDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.roseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Rose['id']) {
    return this.roseRepository.findById(id);
  }

  update(id: Rose['id'], updateRoseDto: UpdateRoseDto) {
    return this.roseRepository.update(id, updateRoseDto);
  }

  remove(id: Rose['id']) {
    return this.roseRepository.remove(id);
  }
}
