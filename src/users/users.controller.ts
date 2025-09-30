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
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from '../jwt/jwt.guard';
import { RolesGuard } from '../jwt/roles.guard';
import { Roles } from '../jwt/roles.decorator';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Criar novo usuário',
    description: 'Apenas administradores podem criar novos usuários. Requer token JWT de admin.' 
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem criar usuários' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Listar usuários com filtros opcionais',
    description: 'Lista todos os usuários. Apenas para administradores. Use os filtros para refinar a busca.' 
  })
  @ApiQuery({ name: 'role', required: false, example: 'admin', description: 'Filtrar por papel (admin ou user)' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'name', description: 'Campo para ordenação (name, createdAt)' })
  @ApiQuery({ name: 'order', required: false, example: 'asc', description: 'Ordem da classificação (asc ou desc)' })
  @ApiQuery({ name: 'name', required: false, example: 'João', description: 'Buscar usuários que contenham este nome' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem listar usuários' })
  findAll(@Query() query) {
    return this.usersService.findAll(query);
  }

  @Get('inactive')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Listar usuários inativos',
    description: 'Retorna usuários que não fizeram login nos últimos 30 dias ou nunca fizeram login' 
  })
  @ApiResponse({ status: 200, description: 'Lista de usuários inativos' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem ver usuários inativos' })
  findInactiveUsers() {
    return this.usersService.findInactiveUsers();
  }

  @Get('profile')
  @ApiOperation({ 
    summary: 'Obter perfil do usuário logado',
    description: 'Retorna as informações do usuário autenticado pelo token JWT' 
  })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ 
    summary: 'Atualizar perfil do usuário logado',
    description: 'Permite ao usuário atualizar seu próprio perfil. Não permite alterar role.' 
  })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    return this.usersService.update(req.user.userId, updateProfileDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar usuário por ID',
    description: 'Administradores podem buscar qualquer usuário. Usuários regulares só podem buscar o próprio perfil.' 
  })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Sem permissão para acessar este usuário' })
  findOne(@Param('id') id: string, @Request() req) {
    // Verificar se é admin ou se está acessando o próprio perfil
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('Você só pode acessar seu próprio perfil');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar usuário',
    description: 'Administradores podem atualizar qualquer usuário. Usuários regulares só podem atualizar o próprio perfil.' 
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Sem permissão para atualizar este usuário' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    // Verificar se é admin ou se está atualizando o próprio perfil
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('Você só pode atualizar seu próprio perfil');
    }
    
    // Usuários regulares não podem alterar o próprio role
    if (req.user.role !== 'admin' && updateUserDto.role) {
      throw new ForbiddenException('Apenas administradores podem alterar roles de usuários');
    }
    
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Deletar usuário',
    description: 'Remove permanentemente um usuário do sistema. Apenas para administradores.' 
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT necessário' })
  @ApiResponse({ status: 403, description: 'Apenas admins podem deletar usuários' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
