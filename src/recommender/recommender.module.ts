import { Module } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { RecommenderController } from './recommender.controller';
import { Neo4jModule } from '../database/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule], 
  controllers: [RecommenderController],
  providers: [RecommenderService],
  exports: [RecommenderService], 
})
export class RecommenderModule {}
