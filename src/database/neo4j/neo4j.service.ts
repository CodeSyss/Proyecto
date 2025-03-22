import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
    private driver: Driver;
    private isDriverInitialized: boolean = false;
    private driverInitializedPromise: Promise<void>;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        const url = this.configService.getOrThrow<string>('NEO4J_URL');
        const username = this.configService.getOrThrow<string>('NEO4J_USERNAME');
        const password = this.configService.getOrThrow<string>('NEO4J_PASSWORD');
        this.driverInitializedPromise = this.initializeDriver(url, username, password);
        await this.driverInitializedPromise;
    }

    private async initializeDriver(url: string, username: string, password: string) {
        try {
            this.driver = neo4j.driver(url, neo4j.auth.basic(username, password));
            console.log('Driver creado, probando conexión...');

            const session = this.driver.session();
            await session.run('RETURN 1');
            await session.close();

            this.isDriverInitialized = true;
            console.log('Conexión a Neo4j establecida con éxito');
        } catch (error) {
            console.error('Error conectando a Neo4j:', error.message);
            throw new Error('No se pudo establecer la conexión a Neo4j');
        }
    }

    async onModuleDestroy() {
        await this.driver?.close();
    }

    async getSession(): Promise<Session> {
        await this.driverInitializedPromise;

        if (!this.isDriverInitialized) {
            throw new Error('Driver de Neo4j no inicializado');
        }

        return this.driver.session();
    }
}
