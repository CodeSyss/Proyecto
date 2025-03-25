import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j/neo4j.service';

@Injectable()
export class RecommenderService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getRecommendations(userId: string): Promise<any[]> {
    const session = await this.neo4jService.getSession();
    try {
      const query = `
        MATCH (u:User {id: $userId})-[:PURCHASED]->(p:Product)
        MATCH (other:User)-[:PURCHASED]->(p)
        MATCH (other)-[:PURCHASED]->(rec:Product)
        WHERE NOT (u)-[:PURCHASED]->(rec)
        RETURN rec.id AS productId, rec.name AS productName, COUNT(*) AS relevance
        ORDER BY relevance DESC
        LIMIT 5;
      `;
      
      const result = await session.run(query, { userId });
      return result.records.map(record => ({
        id: record.get('productId'),
        name: record.get('productName'),
        score: record.get('relevance')
      }));
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      throw new Error('No se pudieron obtener recomendaciones');
    } finally {
      await session.close();
    }
  }
}
