import { PartialType } from '@nestjs/mapped-types';
import { CreateRecommenderDto } from './create-recommender.dto';

export class UpdateRecommenderDto extends PartialType(CreateRecommenderDto) {}
