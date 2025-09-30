import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Token de ID do Google Firebase',
    example: 'eyJhbGciOiJSUzI1NiIs...'
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({
    description: 'Email do usuário Google',
    example: 'usuario@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Nome do usuário Google',
    example: 'João Silva'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID único do usuário no Google',
    example: '123456789012345678901'
  })
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({
    description: 'URL da foto do perfil (opcional)',
    example: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    required: false
  })
  @IsString()
  @IsOptional()
  photoURL?: string;
}