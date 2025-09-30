import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Este email já está cadastrado no sistema');
    }

    // Hash password if provided
    if (createUserDto.password) {
      const bcrypt = require('bcrypt');
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = await this.prisma.user.create({ data: createUserDto });
    const { password, ...result } = user;
    return result;
  }

  async findAll(query: any) {
    const { role, sortBy, order, name } = query;
    const where: any = {};
    if (role) where.role = role;
    if (name) where.name = { contains: name };

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
    }

    const users = await this.prisma.user.findMany({ where, orderBy });
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se a senha foi alterada, fazer hash
    if (updateUserDto.password) {
      const bcrypt = require('bcrypt');
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Verificar se o email já existe (se está sendo alterado)
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new BadRequestException('Este email já está cadastrado no sistema');
      }
    }

    const user = await this.prisma.user.update({ where: { id }, data: updateUserDto });
    const { password, ...result } = user;
    return result;
  }

  async remove(id: string) {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async findInactiveUsers() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { lastLogin: null },
          { lastLogin: { lt: thirtyDaysAgo } },
        ],
      },
    });
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }
}
