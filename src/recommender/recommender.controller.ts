import { Controller, Get, Param } from '@nestjs/common';
import { RecommenderService } from './recommender.service';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get(':userId')
  async getUserRecommendations(@Param('userId') userId: string) {
    return this.recommenderService.getRecommendations(userId);
  }
}

