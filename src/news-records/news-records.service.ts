import { Injectable } from '@nestjs/common';
import { CreateNewsRecordsDto } from './dto/create-news-records.dto';
import { UpdateNewsRecordsDto } from './dto/update-news-records.dto';
import { NewsRecordsRepository } from './infrastructure/persistence/news-records.repository';
import { NewsRecords } from './domain/news-records';
import { FindAllNewsRecordsDto } from './dto/find-all-news-records.dto';

@Injectable()
export class NewsRecordsService {
  constructor(private readonly newsRecordsRepository: NewsRecordsRepository) {}

  create(createNewsRecordsDto: CreateNewsRecordsDto) {
    return this.newsRecordsRepository.create(createNewsRecordsDto);
  }

  findAllWithPagination(filterOptions: FindAllNewsRecordsDto) {
    return this.newsRecordsRepository.findAllWithPagination(filterOptions);
  }

  findOne(id: NewsRecords['id']) {
    return this.newsRecordsRepository.findById(id);
  }

  update(id: NewsRecords['id'], updateNewsRecordsDto: UpdateNewsRecordsDto) {
    return this.newsRecordsRepository.update(id, updateNewsRecordsDto);
  }

  remove(id: NewsRecords['id']) {
    return this.newsRecordsRepository.remove(id);
  }
}
