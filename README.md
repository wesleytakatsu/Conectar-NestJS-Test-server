# 🚀 Conectar Server - Sistema de Gerenciamento de Usuários NestJS

<div align="center">
  
  ![NestJS](https://img.shields.io/badge/NestJS-11+-E0234E?logo=nestjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-6.16+-2D3748?logo=prisma&logoColor=white)
  ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)
  ![Tests](https://img.shields.io/badge/Tests-Jest%20%E2%9C%85-C21325?logo=jest&logoColor=white)
  ![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?logo=swagger&logoColor=black)

  **API REST robusta com NestJS, autenticação JWT, documentação Swagger e integração Prisma**

</div>


---

## 🌐 Live Demo

**🎯 Acesse a aplicação online:** [https://conectarteste.pages.dev/](https://conectarteste.pages.dev/)  
**Acesse o teste com Swagger da API:** [https://discussing-around-attorney-prototype.trycloudflare.com/api/](https://discussing-around-attorney-prototype.trycloudflare.com/api/)  
Ou baixe uma versão release aqui no GitHub.

---

**Credenciais padrão do admin:**
- Para criar a conta rode: npx ts-node src/seed.ts
- Email: `admin@conectar.com`
- Senha: `admin123`

* OBS: Login com o Google disponível só no Android.
Na versão Web só se rodar em ambiente local com as credenciais que eu posso passar por ter chaves confidenciais.
Na Cloudflare Pages grátis não é permitido usar Oauth do Google.

Meu contato do WhatsApp: (21) 97526-3910
  
---
  
**URLs importantes:**
- API: `http://localhost:3010`
- Swagger UI: `http://localhost:3010/api`
- Health Check: `http://localhost:3010/health`

---

## 🎯 Sobre o Projeto

O **Conectar Server** é uma API REST desenvolvida em NestJS como parte de um sistema completo de gerenciamento de usuários e empresas. O projeto demonstra a implementação de uma **arquitetura escalável**, **segurança robusta** e **documentação automática** seguindo as melhores práticas do ecossistema Node.js/TypeScript.

### 🌟 Principais Características

- ✅ **Arquitetura Modular**: Estrutura baseada em módulos NestJS
- ✅ **Autenticação JWT**: Sistema completo com refresh tokens
- ✅ **Documentação Swagger**: API docs interativa e automática
- ✅ **Validação de Dados**: DTOs com class-validator
- ✅ **ORM Prisma**: Type-safe database queries
- ✅ **Testes Abrangentes**: Unit, Integration e E2E tests
- ✅ **CORS Configurado**: Cross-origin requests seguros
- ✅ **Rate Limiting**: Proteção contra abuse
- ✅ **Logging Avançado**: Sistema de logs estruturado

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

```bash
# Node.js 18+
node --version

# NPM ou Yarn
npm --version

# Git
git --version
```

### 🔧 Configuração Inicial

1. **Clone o repositório:**
```bash
gh repo clone wesleytakatsu/Conectar-NestJS-Test-server
cd Conectar-NestJS-Test-server
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o arquivo de ambiente:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as variáveis conforme necessário
nano .env
```

4. **Configure o banco de dados:**
```bash
# Execute as migrações
npx prisma migrate dev

# Gere o Prisma Client
npx prisma generate

# Execute o seed para dados iniciais
npx ts-node src/seed.ts

# Instale o pacote necessário para variáveis
npm install dotenv
```

### 🚀 **Execução Rápida em Produção (PM2)**

**Para executar rapidamente em produção com PM2:**

```bash
# 1. Instale PM2 globalmente
sudo npm install -g pm2

# 2. Compile o projeto
npm run build

# 3. Crie diretório de logs  
mkdir -p logs

# 4. Inicie com PM2
pm2 start ecosystem.config.json

# 5. Verifique o status
pm2 show conectar-api

# 6. Monitore os logs
pm2 logs conectar-api --lines 20
```

**✅ Aplicação rodando em:** `http://localhost:3000`  
**📚 Documentação Swagger:** `http://localhost:3000/api`

---

### ▶️ Executando em Modo Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run start:dev

# Modo debug com breakpoints
npm run start:debug

# Modo padrão (sem hot reload)
npm start
```

**Saída esperada:**
```
[Nest] 12345  - DD/MM/YYYY, HH:MM:SS     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - DD/MM/YYYY, HH:MM:SS     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - DD/MM/YYYY, HH:MM:SS     LOG [RoutesResolver] AuthController {/auth}:
[Nest] 12345  - DD/MM/YYYY, HH:MM:SS     LOG [RouterExplorer] Mapped {/auth/login, POST} route
[Nest] 12345  - DD/MM/YYYY, HH:MM:SS     LOG [NestApplication] Nest application successfully started
Servidor rodando em http://localhost:3000
Documentação Swagger: http://localhost:3000/api

🔧 Para testar no Swagger:
  1. Acesse: http://localhost:3000/api
  2. Faça login com: admin@conectar.com / admin123
  3. Copie o access_token e clique em Authorize
  4. Teste as rotas protegidas!
```

### 🚀 Executando em Modo Produção

#### **Opção 1: Build e Execução Direta**

```bash
# 1. Compile o projeto
npm run build

# 2. Configure ambiente de produção
cp .env.example .env.production

# Edite as variáveis para produção:
# NODE_ENV=production
# DATABASE_URL="file:./production.db"
# JWT_SECRET="sua-chave-secura-aqui"
# CORS_ORIGIN="https://seudominio.com"

# 3. Execute migrações em produção
NODE_ENV=production npx prisma migrate deploy

# 4. Execute o seed (se necessário)
NODE_ENV=production npx ts-node src/seed.ts

# 5. Inicie o servidor
NODE_ENV=production npm run start:prod
```

#### **Opção 2: Com PM2 (Recomendado para Produção)**

```bash
# 1. Instale PM2 globalmente
sudo npm install -g pm2

# 2. Compile o projeto
npm run build

# 3. Crie diretório de logs
mkdir -p logs

# 4. Inicie a aplicação com PM2
pm2 start ecosystem.config.json

# 5. Verificar status da aplicação
pm2 show conectar-api

# 6. Ver logs em tempo real (últimas 20 linhas)
pm2 logs conectar-api --lines 20
```

**Comandos úteis do PM2:**
```bash
# Monitorar todas as aplicações
pm2 monit

# Ver status de todos os processos
pm2 status

# Parar a aplicação
pm2 stop conectar-api

# Reiniciar a aplicação
pm2 restart conectar-api

# Deletar a aplicação do PM2
pm2 delete conectar-api

# Ver logs específicos
pm2 logs conectar-api --lines 50

# Salvar configuração atual
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
```

**Resultado esperado após `pm2 start`:**
```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ conectar-api       │ fork     │ 0    │ online    │ 0%       │ 33.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

#### **Opção 3: Como Serviço do Sistema**

```bash
# Copie o arquivo de serviço para systemd
sudo cp conectar-api.service /etc/systemd/system/

# Recarregue o systemd
sudo systemctl daemon-reload

# Habilite o serviço
sudo systemctl enable conectar-api

# Inicie o serviço
sudo systemctl start conectar-api

# Verifique o status
sudo systemctl status conectar-api

# Ver logs
sudo journalctl -u conectar-api -f
```

### 🛑 **Parando o Servidor**

```bash
# Se executando em terminal direto
# Use Ctrl+C para parar

# Se usando PM2
pm2 stop conectar-api          # Parar a aplicação
pm2 delete conectar-api        # Remover completamente do PM2
pm2 kill                       # Parar o daemon PM2 (todas as apps)

# Se usando systemd
sudo systemctl stop conectar-api

# Verificar processos rodando na porta 3000
sudo lsof -i :3000

# Matar processo específico pela porta (último recurso)
sudo lsof -t -i:3000 | xargs sudo kill -9

# Verificar status após parar
pm2 status                     # Ver se ainda está no PM2
curl http://localhost:3000     # Deve dar erro de conexão
```

---

## 🏗️ Arquitetura e Tecnologias

### 📋 Justificativas Técnicas

#### **Framework: NestJS**
- **Escolha**: NestJS oferece **estrutura robusta** e **arquitetura escalável** baseada no Angular
- **Vantagens**:
  - Decorators e DI container nativo
  - TypeScript first-class support
  - Modular architecture
  - Compatibilidade com Express/Fastify
- **Implementação**: Módulos separados por feature (Auth, Users, Companies)

#### **ORM: Prisma**
- **Escolha**: Prisma supera ORMs tradicionais em **type safety** e **developer experience**
- **Vantagens**:
  - Type-safe database queries
  - Auto-generated client
  - Database migrations
  - Introspection capabilities
- **Implementação**: Schema-first development com migrations automáticas

#### **Autenticação: JWT + Passport**
- **Escolha**: JWT oferece **stateless authentication** ideal para APIs REST
- **Vantagens**:
  - Escalabilidade (sem session storage)
  - Cross-domain compatibility
  - Self-contained tokens
  - Refresh token strategy
- **Implementação**: JWT Strategy com refresh tokens e role-based access

#### **Documentação: Swagger/OpenAPI**
- **Escolha**: Swagger automatiza documentação e oferece **interactive testing**
- **Vantagens**:
  - Auto-generated documentation
  - Interactive API explorer
  - Schema validation
  - Client code generation
- **Implementação**: Decorators automáticos com DTOs

### 🛠️ Stack Tecnológica

#### **Core Framework**
- **NestJS**: `^11.0.1` - Framework Node.js progressivo
- **TypeScript**: `^5.7.3` - Linguagem principal com tipagem estática

#### **Database & ORM**
- **Prisma**: `^6.16.2` - Type-safe database toolkit
- **SQLite**: Database embarcado para desenvolvimento
- **@prisma/client**: `^6.16.2` - Client auto-gerado

#### **Autenticação & Segurança**
- **@nestjs/passport**: `^11.0.5` - Estratégias de autenticação
- **@nestjs/jwt**: `^11.0.0` - JWT tokens
- **passport-jwt**: `^4.0.1` - JWT strategy para Passport
- **bcrypt**: `^6.0.0` - Hash de senhas

#### **Validação & Transformação**
- **class-validator**: `^0.14.2` - Validação decorativa
- **class-transformer**: `^0.5.1` - Serialização de objetos

#### **Documentação & API**
- **@nestjs/swagger**: `^11.2.0` - OpenAPI/Swagger integration
- **@nestjs/platform-express**: `^11.0.1` - Platform HTTP

#### **Testes**
- **Jest**: `^30.0.0` - Framework de testes
- **Supertest**: `^7.0.0` - HTTP testing
- **@nestjs/testing**: `^11.0.1` - Utilities de teste NestJS

#### **Development Tools**
- **ESLint**: `^9.18.0` - Linting
- **Prettier**: `^3.4.2` - Code formatting
- **ts-jest**: `^29.2.5` - Jest transformer para TypeScript

---

## ✨ Funcionalidades Implementadas

### 🔐 **Sistema de Autenticação**

#### **Registro e Login JWT**
- ✅ **Registro de usuários** com validação de email único
- ✅ **Login com JWT** tokens (access + refresh)
- ✅ **Hash de senhas** com bcrypt (salt rounds: 10)
- ✅ **Validação de credenciais** em tempo real
- ✅ **Estratégia JWT** com Passport

```typescript
// Exemplo de uso da API de Auth
POST /auth/register
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "minhasenha123"
}

POST /auth/login
{
  "email": "joao@exemplo.com", 
  "password": "minhasenha123"
}
```

#### **Autenticação Google (Preparado)**
- ✅ **Endpoint Google Auth**: `/auth/google`
- ✅ **Integração preparada** para Google OAuth2
- ✅ **Criação automática** de usuários Google
- ✅ **Merge de contas** existentes

### 👥 **Gerenciamento de Usuários**

#### **CRUD Completo**
- ✅ **Listagem com filtros**: role, status, ordenação
- ✅ **Busca por nome/email**: query parameters
- ✅ **Paginação**: limit/offset support
- ✅ **Criação de usuários**: com validações
- ✅ **Atualização**: parcial com PATCH
- ✅ **Exclusão**: soft delete ou hard delete
- ✅ **Perfil do usuário**: endpoint próprio

```typescript
// Exemplos de endpoints de usuários
GET /users?role=admin&search=joão&limit=10&offset=0
POST /users
PATCH /users/:id
DELETE /users/:id
GET /users/profile (usuário logado)
PATCH /users/profile (atualizar próprio perfil)
```

#### **Funcionalidades Avançadas**
- ✅ **Usuários inativos**: `/users/inactive` (30+ dias)
- ✅ **Controle de roles**: admin/user permissions
- ✅ **Last login tracking**: atualização automática
- ✅ **Validações robustas**: DTOs com class-validator

### 🏢 **Gerenciamento de Empresas**

#### **Sistema Empresarial Completo**
- ✅ **CRUD de empresas**: razão social, CNPJ, endereço
- ✅ **Validação CNPJ**: algoritmo brasileiro
- ✅ **Status control**: ativo/inativo
- ✅ **Conecta Plus**: flag booleana para planos
- ✅ **Busca e filtros**: por status, cidade, CNPJ

```typescript
// Exemplos de endpoints de empresas
GET /companies?status=ativo&cidade=São Paulo
POST /companies
{
  "razaoSocial": "Empresa LTDA",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@empresa.com",
  "conectaPlus": true
}
```

### 🔒 **Autorização e Segurança**

#### **Role-Based Access Control (RBAC)**
- ✅ **Guards personalizados**: `JwtGuard`, `RolesGuard`
- ✅ **Decorators**: `@Roles('admin')`, `@Public()`
- ✅ **Middleware de auth**: JWT extraction automático
- ✅ **Route protection**: aplicação granular

```typescript
// Exemplo de uso dos guards
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
@Get()
async getAllUsers() {
  // Apenas admins podem acessar
}
```

#### **Segurança Adicional**
- ✅ **CORS configurado**: origens específicas
- ✅ **Validation pipes**: sanitização automática
- ✅ **Rate limiting**: proteção contra abuse
- ✅ **Helmet integration**: security headers

### 📊 **Documentação e Monitoramento**

#### **Swagger/OpenAPI**
- ✅ **Documentação automática**: gerada via decorators
- ✅ **Interface interativa**: teste direto no browser
- ✅ **Autenticação JWT**: bearer token integration
- ✅ **Schemas completos**: DTOs documentados
- ✅ **Exemplos de uso**: requests/responses

#### **Health Checks**
- ✅ **Health endpoint**: `/health`
- ✅ **Database connectivity**: verificação automática
- ✅ **Memory usage**: métricas básicas
- ✅ **Uptime tracking**: tempo de execução

---

## 🧪 Testes Automatizados

### 📈 **Estratégia de Testes**

```
✅ Testes Unitários: Isolados e rápidos
✅ Testes de Integração: Módulos completos
✅ Testes E2E: Fluxos end-to-end
✅ Testes de Performance: Load testing
```

#### **Estrutura de Testes**
```
test/
├── unit/ (Testes Unitários)
│   ├── auth/
│   │   ├── auth.service.spec.ts
│   │   └── jwt.strategy.spec.ts
│   ├── users/
│   │   ├── users.service.spec.ts
│   │   └── users.controller.spec.ts
│   └── companies/
│       ├── companies.service.spec.ts
│       └── companies.controller.spec.ts
├── integration/ (Testes de Integração)
│   ├── auth.e2e-spec.ts
│   ├── users.e2e-spec.ts
│   └── companies.e2e-spec.ts
├── e2e/ (Testes End-to-End)
│   └── app.e2e-spec.ts
└── fixtures/ (Dados de teste)
    ├── users.fixture.ts
    └── companies.fixture.ts
```

### 🔬 **Tipos de Testes**

#### **Testes Unitários**
- ✅ **Services**: Lógica de negócio isolada
- ✅ **Controllers**: Endpoints e validações
- ✅ **Guards**: Autenticação e autorização  
- ✅ **Pipes**: Transformação e validação
- ✅ **Strategies**: JWT e auth strategies

#### **Testes de Integração**
- ✅ **Database Integration**: Prisma operations
- ✅ **Module Testing**: Injeção de dependências
- ✅ **Auth Flow**: Login completo
- ✅ **CRUD Operations**: Create, read, update, delete

#### **Testes E2E**
- ✅ **API Endpoints**: Requisições HTTP completas
- ✅ **Authentication Flow**: Login → Access → Logout
- ✅ **Error Handling**: Status codes e mensagens
- ✅ **Data Validation**: Input/output validation

### ▶️ **Executando Testes**

#### **Comandos Básicos**
```bash
# Todos os testes
npm test

# Testes unitários apenas
npm run test:unit

# Testes de integração apenas
npm run test:integration

# Testes E2E apenas
npm run test:e2e

# Testes E2E com banco em memória
npm run test:e2e:memory

# Todos os testes (unit + e2e)
npm run test:all

# Suite completa (unit + e2e + memory)
npm run test:complete
```

#### **Modo Watch e Coverage**
```bash
# Watch mode (reruns automático)
npm run test:watch

# Coverage report
npm run test:cov

# Debug mode
npm run test:debug

# CI mode (sem watch)
npm run test:ci
```

#### **Configurações Específicas**

**Jest Unitários (`jest.config.js`):**
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
};
```

**Jest E2E (`test/jest-e2e.json`):**
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

---

## 📁 Estrutura do Projeto

### 🏗️ **Arquitetura Modular NestJS**

```
src/
├── main.ts                      # Bootstrap da aplicação
├── app.module.ts               # Módulo raiz
├── app.controller.ts           # Controller principal (health)
├── app.service.ts             # Service principal
├── seed.ts                    # Script de dados iniciais
├── auth/                      # Módulo de Autenticação
│   ├── auth.module.ts         # Módulo de auth
│   ├── auth.controller.ts     # Endpoints de auth
│   ├── auth.service.ts        # Lógica de autenticação
│   ├── dto/                   # Data Transfer Objects
│   │   ├── register.dto.ts    # DTO de registro
│   │   ├── login.dto.ts       # DTO de login
│   │   └── google-auth.dto.ts # DTO Google Auth
│   └── guards/                # Guards de autenticação
│       └── roles.guard.ts     # Guard baseado em roles
├── jwt/                       # Módulo JWT
│   ├── jwt.module.ts         # Módulo JWT
│   ├── jwt.strategy.ts       # Estratégia Passport JWT
│   └── jwt-auth.guard.ts     # Guard JWT
├── users/                     # Módulo de Usuários
│   ├── users.module.ts       # Módulo de users
│   ├── users.controller.ts   # Endpoints de usuários
│   ├── users.service.ts      # Lógica de usuários
│   └── dto/                  # DTOs de usuário
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── user-response.dto.ts
├── companies/                 # Módulo de Empresas
│   ├── companies.module.ts   # Módulo de companies
│   ├── companies.controller.ts # Endpoints de empresas
│   ├── companies.service.ts  # Lógica de empresas
│   └── dto/                  # DTOs de empresa
│       ├── create-company.dto.ts
│       ├── update-company.dto.ts
│       └── company-response.dto.ts
└── prisma/                   # Módulo Prisma
    ├── prisma.module.ts      # Módulo Prisma
    └── prisma.service.ts     # Service do Prisma

prisma/
├── schema.prisma             # Schema do banco
├── migrations/               # Migrações do Prisma
│   ├── 20241230_init/
│   ├── 20241230_add_companies/
│   └── migration_lock.toml
└── dev.db                   # Database SQLite

generated/
└── prisma/                  # Cliente Prisma gerado
    ├── index.js
    ├── index.d.ts
    └── schema.prisma

test/
├── jest-e2e.json            # Config Jest E2E
├── jest-e2e-memory.json     # Config Jest memória
├── auth.e2e-spec.ts         # Testes E2E auth
├── users.e2e-spec.ts        # Testes E2E users
└── companies.e2e-spec.ts    # Testes E2E companies
```

### 🎯 **Separação de Responsabilidades**

#### **Modules (Módulos)**
- **Responsabilidade**: Organização e configuração de features
- **Princípio**: Feature-based modules com imports/exports explícitos
- **Exemplo**: `AuthModule` gerencia toda autenticação

#### **Controllers (Controladores)**
- **Responsabilidade**: Handling de requisições HTTP e responses
- **Princípio**: Thin controllers, delegam lógica para services
- **Exemplo**: `AuthController` apenas recebe requests e chama `AuthService`

#### **Services (Serviços)**
- **Responsabilidade**: Lógica de negócio e interação com database
- **Princípio**: Business logic encapsulada e testável
- **Exemplo**: `UsersService` contém toda lógica CRUD de usuários

#### **DTOs (Data Transfer Objects)**
- **Responsabilidade**: Validação e transformação de dados
- **Princípio**: Input/output type safety com validações
- **Exemplo**: `CreateUserDto` valida dados de criação de usuário

#### **Guards (Guardas)**
- **Responsabilidade**: Autenticação e autorização
- **Princípio**: Middleware pattern para proteção de rotas
- **Exemplo**: `JwtGuard` verifica token JWT em requests

---

## 🔧 Configuração Avançada

### ⚙️ **Variáveis de Ambiente**

#### **Desenvolvimento (.env)**
```env
# Environment variables for DEVELOPMENT
DATABASE_URL="file:./dev.db"

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET="conectar-jwt-secret-key-2024"
JWT_EXPIRES_IN="7d"

# CORS Configuration  
CORS_ORIGIN="http://localhost:3000,http://192.168.1.30:3000"

# Debug Configuration
DEBUG_LOGS=true

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

#### **Produção (.env.production)**
```env
# Environment variables for PRODUCTION
DATABASE_URL="file:./production.db"

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration - Use uma chave segura!
JWT_SECRET="conectar-jwt-production-secret-key-2024-secure-random-string"
JWT_EXPIRES_IN="7d"

# CORS Configuration - Seus domínios de produção
CORS_ORIGIN="https://yourproductiondomain.com,https://app.yourproductiondomain.com"

# Debug Configuration
DEBUG_LOGS=false

# Performance Configuration
ENABLE_COMPRESSION=true
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Database Pool (se usando PostgreSQL)
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

### 🗄️ **Configuração do Banco de Dados**

#### **Schema Prisma**
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"      // ou "postgresql", "mysql"
  url      = env("DATABASE_URL")
}
```

#### **Migrações**
```bash
# Criar nova migração
npx prisma migrate dev --name add_new_feature

# Aplicar migrações em produção
npx prisma migrate deploy

# Reset completo do banco (desenvolvimento)
npx prisma migrate reset

# Gerar cliente após mudanças
npx prisma generate

# Visualizar banco de dados
npx prisma studio
```

#### **Diferentes Databases**

**SQLite (Desenvolvimento):**
```env
DATABASE_URL="file:./dev.db"
```

**PostgreSQL (Produção):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/conectar_db?schema=public"
```

**MySQL (Alternativo):**
```env
DATABASE_URL="mysql://user:password@localhost:3306/conectar_db"
```

### 🚀 **Configuração de Deploy**

#### **Docker Configuration**

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY dist ./dist/

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  conectar-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./production.db
      - JWT_SECRET=your-secure-secret-here
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  # Se usando PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=conectar_db
      - POSTGRES_USER=conectar_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### **PM2 Ecosystem (ecosystem.config.json)**
```json
{
  "apps": [{
    "name": "conectar-api",
    "script": "dist/main.js",
    "cwd": "/path/to/your/app",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production",
      "PORT": "3000"
    },
    "env_production": {
      "NODE_ENV": "production",
      "PORT": "3000",
      "DATABASE_URL": "file:./production.db"
    },
    "error_file": "./logs/err.log",
    "out_file": "./logs/out.log",
    "log_file": "./logs/combined.log",
    "time": true,
    "restart_delay": 4000,
    "max_restarts": 10,
    "min_uptime": "10s",
    "max_memory_restart": "300M"
  }]
}
```

---

## 📚 API Documentation

### 🔗 **Swagger/OpenAPI**

#### **Acessando a Documentação**
- **URL**: `http://localhost:3000/api`
- **Autenticação**: JWT Bearer token
- **Interactive Testing**: Diretamente na interface

#### **Como Usar o Swagger**

1. **Acesse a documentação**: `http://localhost:3000/api`

2. **Faça login para obter token**:
   ```bash
   POST /auth/login
   {
     "email": "admin@conectar.com",
     "password": "admin123"
   }
   ```

3. **Autorize no Swagger**:
   - Clique no botão "Authorize" 
   - Digite: `Bearer SEU_ACCESS_TOKEN_AQUI`
   - Clique "Authorize"

4. **Teste endpoints protegidos**:
   - Todos os endpoints agora funcionarão com sua autenticação

### 📊 **Principais Endpoints**

#### **Autenticação**
```http
POST /auth/register      # Registrar novo usuário
POST /auth/login         # Login com email/senha
POST /auth/google        # Login com Google (preparado)
```

#### **Usuários**
```http
GET    /users            # Listar usuários (admin)
POST   /users            # Criar usuário (admin)
GET    /users/:id        # Buscar usuário por ID (admin)
PATCH  /users/:id        # Atualizar usuário (admin)
DELETE /users/:id        # Deletar usuário (admin)
GET    /users/profile    # Perfil do usuário logado
PATCH  /users/profile    # Atualizar próprio perfil
GET    /users/inactive   # Usuários inativos 30+ dias (admin)
```

#### **Empresas**
```http
GET    /companies        # Listar empresas
POST   /companies        # Criar empresa
GET    /companies/:id    # Buscar empresa por ID
PATCH  /companies/:id    # Atualizar empresa
DELETE /companies/:id    # Deletar empresa
```

#### **Utilitários**
```http
GET    /                 # Health check
GET    /health          # Status detalhado do servidor
```

### 🔍 **Exemplos de Uso**

#### **Filtros e Paginação**
```http
GET /users?role=admin&search=joão&limit=10&offset=0
GET /companies?status=ativo&cidade=São Paulo&limit=20
```

#### **Criação de Usuário**
```json
POST /users
{
  "name": "João Silva",
  "email": "joao@exemplo.com", 
  "password": "senha123",
  "role": "user"
}
```

#### **Atualização Parcial**
```json
PATCH /users/123
{
  "name": "João Santos Silva"
}
```

#### **Criação de Empresa**
```json
POST /companies
{
  "razaoSocial": "Empresa LTDA",
  "nomeFantasia": "Empresa",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@empresa.com",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "conectaPlus": true
}
```

---

## 🔍 Debugging e Troubleshooting

### 🐛 **Problemas Comuns**

#### **1. Erro de Porta em Uso**
```bash
# Erro: EADDRINUSE: address already in use :::3000
# Solução: Encontrar e matar processo
lsof -t -i:3000 | xargs kill -9

# Ou usar porta diferente
PORT=3001 npm run start:dev
```

#### **2. Erro de Prisma Client**
```bash
# Erro: @prisma/client did not initialize yet
# Solução: Regenerar cliente
npx prisma generate

# Se persistir, limpe node_modules
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

#### **3. Erro de Migração**
```bash
# Erro: Migration failed
# Solução: Reset database (desenvolvimento apenas!)
npx prisma migrate reset --force

# Ou aplicar migrações específicas
npx prisma migrate resolve --applied "20241230123456_migration_name"
```

#### **4. Erro de JWT**
```bash
# Erro: JsonWebTokenError: invalid token
# Solução: Verificar JWT_SECRET no .env
echo $JWT_SECRET

# Verificar se token está sendo enviado corretamente
# Authorization: Bearer TOKEN_AQUI
```

#### **5. Problema de CORS**
```bash
# Erro: CORS policy blocks request
# Solução: Adicionar origin no .env
CORS_ORIGIN="http://localhost:3000,http://localhost:3001,http://192.168.1.30:3000"
```

#### **6. Problemas com PM2**
```bash
# Erro: PM2 não encontra ecosystem.config.json
# Solução: Verificar se arquivo existe e está no diretório correto
ls -la ecosystem.config.json

# Erro: Aplicação não inicia com PM2
# Solução: Verificar logs detalhados
pm2 logs conectar-api --err --lines 50

# Erro: PM2 daemon não responde
# Solução: Reiniciar daemon PM2
pm2 kill
pm2 start ecosystem.config.json

# Verificar se diretório de logs existe
ls -la logs/
mkdir -p logs  # Se não existir

# Ver arquivos de log específicos
tail -f logs/err.log    # Logs de erro
tail -f logs/out.log    # Logs de saída
tail -f logs/combined.log  # Logs combinados
```

### 📊 **Logs e Monitoramento**

#### **Habilitar Debug Logs**
```env
# .env
DEBUG_LOGS=true
NODE_ENV=development
```

#### **Logs Estruturados**
```typescript
// Em qualquer service
import { Logger } from '@nestjs/common';

export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findAll() {
    this.logger.log('Finding all users');
    this.logger.debug('Debug info here');
    this.logger.error('Error occurred', error.stack);
  }
}
```

#### **Performance Monitoring**
```bash
# Usar clinic.js para profiling
npm install -g clinic
clinic doctor -- node dist/main.js

# Ou usar built-in profiler
node --inspect dist/main.js
# Abrir chrome://inspect
```

### 🚨 **Monitoramento de Saúde**

#### **Health Check Endpoint**
```http
GET /health

Response:
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" }
  }
}
```

#### **Custom Health Indicators**
```typescript
// src/health/prisma.health.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.user.findFirst();
      return this.getStatus(key, true);
    } catch (e) {
      return this.getStatus(key, false, { message: e.message });
    }
  }
}
```

---

## 🚀 Deploy e DevOps

### 🌐 **Estratégias de Deploy**

#### **1. Deploy Tradicional (VPS/VM)**

**Preparação do servidor:**
```bash
# Ubuntu/Debian setup
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 global
sudo npm install -g pm2

# Clone e setup
git clone https://github.com/wesleytakatsu/conectar-server.git
cd conectar-server
npm install
npm run build

# Configure environment
cp .env.example .env.production
# Edite .env.production com dados reais

# Database setup
npx prisma migrate deploy
npx prisma generate

# Start with PM2
pm2 start ecosystem.config.json --env production
pm2 save
pm2 startup
```

#### **2. Deploy com Docker**

**Build e Run:**
```bash
# Build image
docker build -t conectar-api:latest .

# Run container
docker run -d \
  --name conectar-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="file:./production.db" \
  -e JWT_SECRET="your-secure-secret" \
  -v $(pwd)/data:/app/data \
  conectar-api:latest

# Com docker-compose
docker-compose up -d
```

#### **3. Deploy Cloud (Heroku/Railway/Render)**

**Heroku example:**
```bash
# Instalar Heroku CLI
npm install -g heroku

# Create app
heroku create conectar-api-prod

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="secure-secret-here"
heroku config:set DATABASE_URL="postgresql://..."

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

### 🔄 **CI/CD Pipeline**

#### **GitHub Actions Example**

**.github/workflows/ci-cd.yml:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Generate Prisma Client
      run: npx prisma generate

    - name: Run unit tests
      run: npm run test:unit

    - name: Run integration tests
      run: npm run test:e2e
      env:
        DATABASE_URL: postgresql://postgres:test@localhost:5432/test_db

    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to production
      run: |
        # Seus comandos de deploy aqui
        echo "Deploying to production..."
```

### 📈 **Monitoramento e Observabilidade**

#### **Application Performance Monitoring (APM)**

**New Relic integration:**
```javascript
// main.ts
import * as newrelic from 'newrelic';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ... rest of setup
}
```

**Datadog integration:**
```javascript
// main.ts
import { StatsD } from 'node-statsd';

const statsd = new StatsD();

// Custom metrics
statsd.increment('api.requests');
statsd.timing('api.response_time', responseTime);
```

#### **Structured Logging**

**Winston configuration:**
```typescript
// src/logger/winston.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = WinstonModule.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});
```

---

## 👥 Contribuição e Desenvolvimento

### 📋 **Guidelines de Desenvolvimento**

#### **Convenções de Código**
```typescript
// Nomenclatura: PascalCase para classes, camelCase para métodos
export class UsersService {
  async findUserById(id: string): Promise<User> {
    // lógica aqui
  }
}

// DTOs sempre com sufixo .dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// Interfaces com prefixo I (opcional)
interface IUserRepository {
  findById(id: string): Promise<User>;
}
```

#### **Estrutura de Commits**
```bash
# Tipos permitidos: feat, fix, docs, style, refactor, test, chore
feat: adiciona autenticação Google
fix: corrige validação de CNPJ 
docs: atualiza documentação da API
test: adiciona testes para UserService
refactor: reestrutura módulo de auth
chore: atualiza dependências
```

#### **Workflow de Desenvolvimento**
```bash
# 1. Criar branch para feature
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver e testar
npm run test:watch  # Durante desenvolvimento
npm run lint        # Verificar code style

# 3. Commit changes
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 4. Push e PR
git push origin feature/nova-funcionalidade
# Abrir Pull Request no GitHub

# 5. Após aprovação, merge para main
```

### 🧪 **Test-Driven Development (TDD)**

#### **Ciclo Red-Green-Refactor**
```bash
# 1. RED: Escreva o teste (falha)
# test/users.service.spec.ts
describe('UsersService', () => {
  it('should create user with valid data', async () => {
    const userData = { name: 'Test', email: 'test@test.com' };
    const result = await service.create(userData);
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
  });
});

# 2. GREEN: Implemente código mínimo (passa)
async create(userData: CreateUserDto): Promise<User> {
  return this.prisma.user.create({ data: userData });
}

# 3. REFACTOR: Melhore o código (mantém passando)
async create(userData: CreateUserDto): Promise<User> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return this.prisma.user.create({ 
    data: { ...userData, password: hashedPassword } 
  });
}
```

### 🔧 **Ferramentas de Desenvolvimento**

#### **VS Code Extensions Recomendadas**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-jest"
  ]
}
```

#### **VS Code Settings**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "jest.autoRun": "watch"
}
```

---

## 📚 Recursos Adicionais

### 🔗 **Links Úteis**

- [📖 NestJS Documentation](https://docs.nestjs.com/)
- [🗄️ Prisma Documentation](https://www.prisma.io/docs/)
- [🔐 JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [📊 Swagger/OpenAPI](https://swagger.io/specification/)
- [🧪 Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [🐳 Docker Best Practices](https://docs.docker.com/develop/best-practices/)

### 📖 **Documentação Relacionada**

- **Frontend Flutter**: Repositório do app mobile
- **Deployment Guide**: Guias específicos de cloud providers
- **API Client SDKs**: Clientes gerados automaticamente

### 🎓 **Materiais de Referência**

- [NestJS Architecture Best Practices](https://docs.nestjs.com/fundamentals/testing)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling)

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico para a empresa **Conectar**.

**Desenvolvido com ❤️ usando NestJS + TypeScript**

---

## 📞 Suporte

Para dúvidas ou problemas:

1. **Issues**: Abra uma issue no GitHub
2. **Documentação**: Consulte este README completo
3. **Swagger UI**: `http://localhost:3000/api` para testar endpoints
4. **Testes**: Execute `npm test` para verificar integridade
5. **Logs**: Verifique logs com `DEBUG_LOGS=true`

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela no repositório!**

[![NestJS](https://img.shields.io/badge/Made%20with-NestJS-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-darkblue?logo=prisma)](https://www.prisma.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Docs-Swagger-green?logo=swagger)](http://localhost:3000/api)
[![Tests](https://img.shields.io/badge/Tests-Jest-red?logo=jest)](./test/)

</div>
