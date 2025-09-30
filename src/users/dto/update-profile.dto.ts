import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Maria Santos',
    description: 'Nome completo do usuário',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'maria.santos@exemplo.com',
    description: 'Email único do usuário',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'novaSenha123',
    description: 'Nova senha do usuário',
    required: false
  })
  @IsOptional()
  @IsString()
  password?: string;
}