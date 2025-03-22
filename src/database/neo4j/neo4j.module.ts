import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jModule {}

