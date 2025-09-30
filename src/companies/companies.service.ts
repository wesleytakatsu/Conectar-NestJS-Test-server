import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll(query?: any) {
    const { status, conectaPlus, sortBy = 'createdAt', order = 'desc', search } = query || {};
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (conectaPlus !== undefined) {
      where.conectaPlus = conectaPlus === 'true';
    }
    
    if (search) {
      // SQLite não suporta mode: 'insensitive', então usamos apenas contains
      where.OR = [
        { razaoSocial: { contains: search } },
        { nomeFantasia: { contains: search } },
        { cnpj: { contains: search } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'razaoSocial') {
      orderBy.razaoSocial = order;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = order;
    } else {
      orderBy.createdAt = order;
    }

    return this.prisma.company.findMany({
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
      });
    } catch (error) {
      throw new NotFoundException('Empresa não encontrada');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Empresa não encontrada');
    }
  }

  async findByCnpj(cnpj: string) {
    return this.prisma.company.findUnique({
      where: { cnpj },
    });
  }
}