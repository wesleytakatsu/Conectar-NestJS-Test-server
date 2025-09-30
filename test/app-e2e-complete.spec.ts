import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Sistema de Gerenciamento de Usuários - Testes E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let userToken: string;

  let adminUserId: string;
  let regularUserId: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await cleanupTestData();
    await createBaseTestUsers();
    await generateAuthTokens();
  });

  async function setupTestDatabase() {
    try {
      await prisma.user.deleteMany({});
      await prisma.company.deleteMany({});
    } catch (error) {
      throw error;
    }
  }

  async function cleanupTestDatabase() {
    try {
      await prisma.user.deleteMany({});
      await prisma.company.deleteMany({});
    } catch (error) {
    }
  }

  async function cleanupTestData() {
    await prisma.user.deleteMany({
      where: {
        email: {
          not: {
            in: ['admin@test.com', 'user@test.com']
          }
        }
      }
    });
  }

  async function createBaseTestUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    adminUserId = adminUser.id;

    const regularUser = await prisma.user.create({
      data: {
        name: 'User Test',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user',
      },
    });
    regularUserId = regularUser.id;

    await prisma.user.create({
      data: {
        name: 'Inactive User',
        email: 'inactive@test.com',
        password: hashedPassword,
        role: 'user',
        lastLogin: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async function generateAuthTokens() {
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      });
    
    adminToken = adminResponse.body.access_token;

    const userResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });
    
    userToken = userResponse.body.access_token;
  }

  describe('Rota Principal', () => {
    it('GET / - deve retornar Hello World', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Sistema de Autenticação', () => {
    describe('Registro de Usuários', () => {
      it('POST /auth/register - deve registrar novo usuário com sucesso', async () => {
        const userData = {
          name: 'Novo Usuário',
          email: 'novo@test.com',
          password: 'password123',
          role: 'user',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', 'Novo Usuário');
        expect(response.body).toHaveProperty('email', 'novo@test.com');
        expect(response.body).toHaveProperty('role', 'user');
        expect(response.body).not.toHaveProperty('password');
        expect(response.body).toHaveProperty('createdAt');
      });

      it('POST /auth/register - deve falhar com email duplicado', async () => {
        const userData = {
          name: 'Usuário Duplicado',
          email: 'admin@test.com',
          password: 'password123',
          role: 'user',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(userData)
          .expect(400);
      });

      it('POST /auth/register - deve falhar com dados inválidos', async () => {
        const userData = {
          name: '',
          email: 'email-inválido',
          password: '123',
        };

        await request(app.getHttpServer())
          .post('/auth/register')
          .send(userData)
          .expect(400);
      });
    });

    describe('Login de Usuários', () => {
      it('POST /auth/login - admin deve fazer login com sucesso', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'password123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('role', 'admin');
        expect(response.body.user).not.toHaveProperty('password');
      });

      it('POST /auth/login - usuário regular deve fazer login com sucesso', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'user@test.com',
            password: 'password123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('role', 'user');
      });

      it('POST /auth/login - deve falhar com credenciais inválidas', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'senhaerrada',
          })
          .expect(401);
      });

      it('POST /auth/login - deve falhar com email inexistente', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'inexistente@test.com',
            password: 'password123',
          })
          .expect(401);
      });
    });
  });

  describe('Gerenciamento de Usuários', () => {
    describe('Listagem de Usuários (Admin)', () => {
      it('GET /users - admin deve listar todos os usuários', async () => {
        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(3);
        
        response.body.forEach((user: any) => {
          expect(user).not.toHaveProperty('password');
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
        });
      });

      it('GET /users - usuário regular não deve listar usuários', async () => {
        await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });

      it('GET /users?role=admin - deve filtrar por role', async () => {
        const response = await request(app.getHttpServer())
          .get('/users?role=admin')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((user: any) => {
          expect(user.role).toBe('admin');
        });
      });

      it('GET /users?sortBy=name&order=asc - deve ordenar por nome', async () => {
        const response = await request(app.getHttpServer())
          .get('/users?sortBy=name&order=asc')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        
        for (let i = 1; i < response.body.length; i++) {
          expect(response.body[i].name.localeCompare(response.body[i - 1].name)).toBeGreaterThanOrEqual(0);
        }
      });

      it('GET /users?sortBy=createdAt&order=desc - deve ordenar por data de criação', async () => {
        const response = await request(app.getHttpServer())
          .get('/users?sortBy=createdAt&order=desc')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        
        for (let i = 1; i < response.body.length; i++) {
          const currentDate = new Date(response.body[i].createdAt);
          const previousDate = new Date(response.body[i - 1].createdAt);
          expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
        }
      });
    });

    describe('Usuários Inativos', () => {
      it('GET /users/inactive - deve retornar usuários inativos', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/inactive')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some((user: any) => user.email === 'inactive@test.com')).toBe(true);
        
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        response.body.forEach((user: any) => {
          if (user.lastLogin) {
            expect(new Date(user.lastLogin).getTime()).toBeLessThan(thirtyDaysAgo.getTime());
          }
        });
      });

      it('GET /users/inactive - usuário regular não deve acessar', async () => {
        await request(app.getHttpServer())
          .get('/users/inactive')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });
    });

    describe('Criação de Usuários (Admin)', () => {
      it('POST /users - admin deve criar usuário com sucesso', async () => {
        const userData = {
          name: 'Usuário Criado Admin',
          email: 'criado@test.com',
          password: 'password123',
          role: 'user',
        };

        const response = await request(app.getHttpServer())
          .post('/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(userData)
          .expect(201);

        expect(response.body).toHaveProperty('name', 'Usuário Criado Admin');
        expect(response.body).toHaveProperty('email', 'criado@test.com');
        expect(response.body).toHaveProperty('role', 'user');
        expect(response.body).not.toHaveProperty('password');
      });

      it('POST /users - usuário regular não deve criar usuário', async () => {
        const userData = {
          name: 'Usuário Não Autorizado',
          email: 'naoautorizado@test.com',
          password: 'password123',
          role: 'user',
        };

        await request(app.getHttpServer())
          .post('/users')
          .set('Authorization', `Bearer ${userToken}`)
          .send(userData)
          .expect(403);
      });

      it('POST /users - deve falhar com dados inválidos', async () => {
        const userData = {
          name: '',
          email: 'email-inválido',
          password: '123',
        };

        await request(app.getHttpServer())
          .post('/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(userData)
          .expect(400);
      });
    });

    describe('Busca de Usuário por ID', () => {
      it('GET /users/:id - admin deve buscar usuário por ID', async () => {
        const response = await request(app.getHttpServer())
          .get(`/users/${regularUserId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', regularUserId);
        expect(response.body).toHaveProperty('email', 'user@test.com');
        expect(response.body).not.toHaveProperty('password');
      });

      it('GET /users/:id - deve falhar com ID inexistente', async () => {
        await request(app.getHttpServer())
          .get('/users/id-inexistente')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });
    });

    describe('Perfil do Usuário', () => {
      it('GET /users/profile - usuário deve acessar próprio perfil', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('email', 'user@test.com');
        expect(response.body).toHaveProperty('name', 'User Test');
        expect(response.body).toHaveProperty('role', 'user');
        expect(response.body).not.toHaveProperty('password');
      });

      it('GET /users/profile - admin deve acessar próprio perfil', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('email', 'admin@test.com');
        expect(response.body).toHaveProperty('role', 'admin');
      });
    });

    describe('Atualização de Usuários', () => {
      it('PATCH /users/:id - usuário deve atualizar próprio perfil', async () => {
        const updateData = {
          name: 'Nome Atualizado',
        };

        const response = await request(app.getHttpServer())
          .patch(`/users/${regularUserId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('name', 'Nome Atualizado');
        expect(response.body).toHaveProperty('id', regularUserId);
      });

      it('PATCH /users/:id - admin deve atualizar qualquer usuário', async () => {
        const updateData = {
          name: 'Atualizado pelo Admin',
          role: 'admin',
        };

        const response = await request(app.getHttpServer())
          .patch(`/users/${regularUserId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('name', 'Atualizado pelo Admin');
        expect(response.body).toHaveProperty('role', 'admin');
      });

      it('PATCH /users/:id - usuário não deve atualizar outro usuário', async () => {
        const updateData = {
          name: 'Tentativa de Atualização',
        };

        await request(app.getHttpServer())
          .patch(`/users/${adminUserId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(403);
      });
    });

    describe('Exclusão de Usuários', () => {
      it('DELETE /users/:id - admin deve excluir usuário', async () => {
        const userToDelete = await prisma.user.create({
          data: {
            name: 'Para Excluir',
            email: 'excluir@test.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
          },
        });

        await request(app.getHttpServer())
          .delete(`/users/${userToDelete.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        const deletedUser = await prisma.user.findUnique({
          where: { id: userToDelete.id }
        });
        expect(deletedUser).toBeNull();
      });

      it('DELETE /users/:id - usuário regular não deve excluir', async () => {
        await request(app.getHttpServer())
          .delete(`/users/${adminUserId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });

      it('DELETE /users/:id - deve falhar com ID inexistente', async () => {
        await request(app.getHttpServer())
          .delete('/users/id-inexistente')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });
    });
  });

  describe('Testes de Autorização e Segurança', () => {
    it('Deve exigir autenticação para rotas protegidas', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('Deve rejeitar token JWT inválido', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });

    it('Deve rejeitar token JWT expirado/malformado', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
        .expect(401);
    });

    it('Deve exigir role admin para operações administrativas', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Teste Role',
          email: 'teste@role.com',
          password: 'password123',
        })
        .expect(403);
    });
  });

  describe('Testes de Performance e Limites', () => {
    it('Deve lidar com requisições simultâneas', async () => {
      const requests = Array.from({ length: 10 }, () =>
        request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${userToken}`)
      );

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email');
      });
    });

    it('Deve validar limites de dados de entrada', async () => {
      const longString = 'a'.repeat(10000);
      
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: longString,
          email: 'limite@test.com',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('Testes de Edge Cases', () => {
    it('Deve lidar com caracteres especiais nos nomes', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'José da Silva Ção',
          email: 'jose@test.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body.name).toBe('José da Silva Ção');
    });

    it('Deve normalizar emails para lowercase', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Email Uppercase',
          email: 'UPPERCASE@TEST.COM',
          password: 'password123',
        })
        .expect(201);

      expect(response.body.email.toLowerCase()).toBe('uppercase@test.com');
    });

    it('Deve rejeitar senhas muito fracas', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Senha Fraca',
          email: 'fraca@test.com',
          password: '123',
        })
        .expect(400);
    });
  });
});