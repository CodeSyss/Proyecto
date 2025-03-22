import { Injectable } from '@nestjs/common';
import { CreateRecommenderDto } from './dto/create-recommender.dto';
import { UpdateRecommenderDto } from './dto/update-recommender.dto';

@Injectable()
export class RecommenderService {
  create(createRecommenderDto: CreateRecommenderDto) {
    return 'This action adds a new recommender';
  }

  findAll() {
    return `This action returns all recommender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recommender`;
  }

  update(id: number, updateRecommenderDto: UpdateRecommenderDto) {
    return `This action updates a #${id} recommender`;
  }

  remove(id: number) {
    return `This action removes a #${id} recommender`;
  }
}
