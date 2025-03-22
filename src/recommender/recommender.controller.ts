import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { CreateRecommenderDto } from './dto/create-recommender.dto';
import { UpdateRecommenderDto } from './dto/update-recommender.dto';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Post()
  create(@Body() createRecommenderDto: CreateRecommenderDto) {
    return this.recommenderService.create(createRecommenderDto);
  }

  @Get()
  findAll() {
    return this.recommenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recommenderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecommenderDto: UpdateRecommenderDto) {
    return this.recommenderService.update(+id, updateRecommenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recommenderService.remove(+id);
  }
}
