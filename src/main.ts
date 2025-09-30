import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obter configurações do .env
  const port = process.env.PORT || 3000;
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000,http://192.168.1.30:3000';
  const debugLogs = process.env.DEBUG_LOGS === 'true';

  // Configurar CORS com origens específicas
  const allowedOrigins = corsOrigin.split(',').map(origin => origin.trim());
  
  app.enableCors({
    origin: (origin, callback) => {
      // Em desenvolvimento, permitir qualquer origem localhost ou se origin for undefined (requisições diretas)
      if (!origin || 
          origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') ||
          allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Não permitido pelo CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Conectar API')
    .setDescription(`
# API de Gerenciamento de Usuários - Conectar

Esta API oferece funcionalidades completas para gerenciamento de usuários.

## Como Usar no Swagger

### Passo 1: Fazer Login
1. Vá até a seção **auth** 
2. Use o endpoint **POST /auth/login**
3. Clique em "Try it out"
4. Use os dados de exemplo já preenchidos:
   - **Email**: admin@conectar.com  
   - **Password**: admin123
5. Execute a requisição e copie o **access_token** da resposta

### Passo 2: Autorizar no Swagger
1. Clique no botão **Authorize** 🔒 (canto superior direito)
2. Cole o token copiado (sem "Bearer", apenas o token)
3. Clique em **Authorize**

### Passo 3: Testar Rotas Protegidas
Agora você pode testar todas as rotas que precisam de autenticação!

## Funcionalidades

- Autenticação JWT
- CRUD completo de usuários  
- Filtros e ordenação
- Controle de permissões por role
- Usuários inativos (30+ dias sem login)
`)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Cole aqui o access_token obtido no login (sem "Bearer")',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', '🔑 Autenticação - Comece aqui! Login para obter token JWT')
    .addTag('users', '👥 Usuários - Rotas protegidas (requer login)')
    .addServer(`http://localhost:${port}`, 'Servidor de Desenvolvimento')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Conectar API - Documentação',
  });

  await app.listen(port);
  
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger: http://localhost:${port}/api`);
  
  if (debugLogs) {
    console.log('\n🔧 Para testar no Swagger:');
    console.log('  1. Acesse: http://localhost:' + port + '/api');
    console.log('  2. Faça login com: admin@conectar.com / admin123');
    console.log('  3. Copie o access_token e clique em Authorize');
    console.log('  4. Teste as rotas protegidas!');
  }
}

bootstrap();
