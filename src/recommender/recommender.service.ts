import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j/neo4j.service';

@Injectable()
export class RecommenderService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getRecommendations(userId: string): Promise<any[]> {
    const session = await this.neo4jService.getSession();
    try {
      const query = `
      // 1. Obtener los productos que el usuario ha comprado
      MATCH (u:User {id: $userId})-[:PLACED_ORDER]->(:Order)-[:CONTAINS_PRODUCT]->(purchasedProduct:Product)
      WITH u, COLLECT(DISTINCT purchasedProduct.id) AS purchasedProductIds

      // 2. Obtener los productos en el carrito del usuario (si existen)
      OPTIONAL MATCH (u)-[:ADDED_TO_CART]->(cartProduct:Product)
      WITH purchasedProductIds, COLLECT(DISTINCT cartProduct.id) AS cartProductIds

      // 3. Unir ambas listas en una sola
      WITH purchasedProductIds + cartProductIds AS allUserProductIds

      // 4. Encontrar usuarios con gustos similares
      MATCH (similarUser:User)-[:PLACED_ORDER]->(:Order)-[:CONTAINS_PRODUCT]->(sharedProduct:Product)
      WHERE sharedProduct.id IN allUserProductIds AND similarUser.id <> $userId
      WITH allUserProductIds, similarUser

      // 5. Obtener productos recomendados (que los usuarios similares compraron pero el usuario actual no)
      MATCH (similarUser)-[:PLACED_ORDER]->(:Order)-[:CONTAINS_PRODUCT]->(recommendation:Product)
      WHERE NOT recommendation.id IN allUserProductIds
      WITH recommendation, COUNT(*) AS relevance

      // 6. Ordenar y devolver los productos recomendados
      RETURN recommendation.id AS productId, 
            recommendation.name AS productName, 
            relevance
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