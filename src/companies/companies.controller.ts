import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtGuard } from '../jwt/jwt.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';

@ApiTags('companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
@UseGuards(JwtGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Criar nova empresa',
    description: 'Apenas administradores podem criar novas empresas. Requer token JWT de admin.' 
  })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem criar empresas' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    // Verificar se CNPJ já existe
    const existingCompany = await this.companiesService.findByCnpj(createCompanyDto.cnpj);
    if (existingCompany) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Listar empresas com filtros opcionais',
    description: 'Lista todas as empresas. Apenas para administradores. Use os filtros para refinar a busca.' 
  })
  @ApiQuery({ name: 'status', required: false, example: 'ativo', description: 'Filtrar por status (ativo ou inativo)' })
  @ApiQuery({ name: 'conectaPlus', required: false, example: 'true', description: 'Filtrar por Conecta Plus (true ou false)' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'razaoSocial', description: 'Campo para ordenação (razaoSocial, createdAt)' })
  @ApiQuery({ name: 'order', required: false, example: 'asc', description: 'Ordem da classificação (asc ou desc)' })
  @ApiQuery({ name: 'search', required: false, example: 'Conectar', description: 'Buscar empresas por razão social, nome fantasia ou CNPJ' })
  @ApiResponse({ status: 200, description: 'Lista de empresas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem listar empresas' })
  findAll(@Query() query) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Buscar empresa por ID',
    description: 'Retorna os dados de uma empresa específica pelo ID. Apenas para admins.' 
  })
  @ApiResponse({ status: 200, description: 'Dados da empresa' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem buscar empresas por ID' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Atualizar empresa',
    description: 'Atualiza os dados de uma empresa. Apenas para administradores.' 
  })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem atualizar empresas' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado por outra empresa' })
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    // Se está atualizando CNPJ, verificar se não existe em outra empresa
    if (updateCompanyDto.cnpj) {
      const existingCompany = await this.companiesService.findByCnpj(updateCompanyDto.cnpj);
      if (existingCompany && existingCompany.id !== id) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Deletar empresa',
    description: 'Remove permanentemente uma empresa do sistema. Apenas para administradores.' 
  })
  @ApiResponse({ status: 200, description: 'Empresa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem deletar empresas' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}