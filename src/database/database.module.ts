import { Module } from '@nestjs/common';
import { MongooseDatabaseModule } from './mongoose/mongoose.module';
import { Neo4jModule } from './neo4j/neo4j.module';

@Module({
  imports: [MongooseDatabaseModule],
  exports: [MongooseDatabaseModule],
})
export class DatabaseModule {}