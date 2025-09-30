import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário registrado com sucesso',
    example: {
      id: 'cmg1exstb0001wsyvj2dlgf6g',
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      role: 'user',
      createdAt: '2025-09-26T22:28:05.280Z',
      updatedAt: '2025-09-26T22:31:11.090Z'
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou email já existe' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Fazer login',
    description: 'Autentica o usuário e retorna token JWT para acesso às rotas protegidas' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'cmg1exsrc0000wsyvghctqgnp',
        name: 'Admin User',
        email: 'admin@conectar.com',
        role: 'admin'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  @ApiOperation({ 
    summary: 'Login/Registro com Google',
    description: 'Autentica usuário via Google. Se o usuário não existir, cria automaticamente uma nova conta.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login com Google realizado com sucesso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'cmg1exsrc0000wsyvghctqgnp',
        name: 'João Silva',
        email: 'joao@gmail.com',
        role: 'user',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        isGoogleUser: true
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados do Google inválidos' })
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleAuth(googleAuthDto);
  }
}
