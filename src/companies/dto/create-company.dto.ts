import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Conectar Tecnologia LTDA',
    description: 'Razão social da empresa'
  })
  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @ApiProperty({
    example: 'Conectar Tech',
    description: 'Nome fantasia da empresa',
    required: false
  })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'CNPJ da empresa'
  })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({
    example: 'contato@conectar.com',
    description: 'Email de contato da empresa',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Telefone de contato',
    required: false
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({
    example: 'Rua das Flores, 123',
    description: 'Endereço da empresa',
    required: false
  })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade',
    required: false
  })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado',
    required: false
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({
    example: '01234-567',
    description: 'CEP',
    required: false
  })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({
    example: 'ativo',
    description: 'Status da empresa (ativo ou inativo)',
    required: false,
    enum: ['ativo', 'inativo']
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: false,
    description: 'Se a empresa possui Conecta Plus',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  conectaPlus?: boolean;
}