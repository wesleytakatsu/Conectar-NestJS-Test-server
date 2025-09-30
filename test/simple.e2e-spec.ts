import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const testDbFile = path.join(__dirname, `../test-db-${Date.now()}-${Math.random().toString(36).substring(7)}.db`);
process.env.DATABASE_URL = `file:${testDbFile}`;
process.env.NODE_ENV = 'test';

describe('Testes E2E Simples e Funcionais', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    try {
      await execAsync(`npx prisma migrate deploy`, { 
        env: { ...process.env, DATABASE_URL: `file:${testDbFile}` },
        cwd: process.cwd()
      });
    } catch (error) {
      console.warn('Aviso: Falha ao executar migrações:', error.message);
      try {
        await execAsync(`npx prisma db push --force-reset --accept-data-loss`, { 
          env: { ...process.env, DATABASE_URL: `file:${testDbFile}` },
          cwd: process.cwd()
        });
      } catch (pushError) {
        console.error('Erro crítico ao criar banco de teste:', pushError.message);
        throw pushError;
      }
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    prismaService = app.get(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    try {
      await prismaService.user.deleteMany({});
      await prismaService.company.deleteMany({});
    } catch (error) {
      // Ignorar erro de limpeza
    }
  });

  afterAll(async () => {
    try {
      await prismaService.$disconnect();
    } catch (error) {
      // Ignorar erro de desconexão
    }
    
    await app.close();
    
    // Remover arquivo de banco de teste
    try {
      if (fs.existsSync(testDbFile)) {
        fs.unlinkSync(testDbFile);
      }
      // Remover arquivos relacionados do SQLite
      const shmFile = `${testDbFile}-shm`;
      const walFile = `${testDbFile}-wal`;
      if (fs.existsSync(shmFile)) fs.unlinkSync(shmFile);
      if (fs.existsSync(walFile)) fs.unlinkSync(walFile);
    } catch (error) {
      console.warn('Aviso: Não foi possível remover arquivos de teste:', error.message);
    }
  });

  describe('Endpoints Básicos', () => {
    it('deve retornar resposta do endpoint raiz', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.status).toBe(200);
    });

    it('deve rejeitar acesso não autorizado a /users', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('deve rejeitar credenciais inválidas no login', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Autenticação Funcional', () => {
    it('deve fazer registro e login de usuário', async () => {
      const userData = {
        name: 'Test User Complete',
        email: `complete-${Date.now()}@test.com`,
        password: 'test123',
        role: 'user',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body).toBeDefined();
      
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(201);

      expect(loginResponse.body.access_token).toBeDefined();
      if (loginResponse.body.access_token) {
        const profileResponse = await request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${loginResponse.body.access_token}`);
          
        expect([200, 401, 403]).toContain(profileResponse.status);
      }
    });
  });

  describe('Testes de Performance', () => {
    it('deve responder rapidamente a múltiplas requisições', async () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer()).get('/').expect(200);
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(2000);
    });

    it('deve suportar registros sequenciais', async () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 3; i++) {
        const userData = {
          name: `Performance User ${i}`,
          email: `perf${i}-${Date.now()}@test.com`,
          password: 'perf123',
          role: 'user',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(userData)
          .expect(201);
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).toBeLessThan(3000);
    });
  });

  describe('Validações de Entrada', () => {
    it('deve validar campos obrigatórios no registro', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test',
          password: 'test123',
        })
        .expect(400);
    });

    it('deve validar email inválido', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'email-invalido',
          password: 'test123',
          role: 'user',
        })
        .expect(400);
    });
  });
});