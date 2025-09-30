import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role || 'user',
      },
    });
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Update lastLogin (only if user still exists)
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      // Se o usuário foi deletado durante o teste, continua normalmente
      if (error.code !== 'P2025') {
        throw error;
      }
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    // Verificar se usuário já existe pelo email ou googleId
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: googleAuthDto.email },
          { googleId: googleAuthDto.googleId }
        ]
      }
    });

    if (user) {
      // Usuário existe, atualizar dados do Google se necessário e fazer login
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          googleId: googleAuthDto.googleId, // Atualizar googleId se não existia
          photoURL: googleAuthDto.photoURL, // Atualizar foto
          isGoogleUser: true,
          // Atualizar nome se for diferente (opcional)
          name: googleAuthDto.name,
        },
      });
    } else {
      // Usuário não existe, criar novo cadastro
      user = await this.prisma.user.create({
        data: {
          name: googleAuthDto.name,
          email: googleAuthDto.email,
          googleId: googleAuthDto.googleId,
          photoURL: googleAuthDto.photoURL,
          isGoogleUser: true,
          role: 'user', // Usuários do Google sempre começam como 'user'
          password: null, // Não precisa de senha para usuários do Google
          lastLogin: new Date(),
        },
      });
    }

    // Gerar JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        photoURL: user.photoURL,
        isGoogleUser: user.isGoogleUser
      },
    };
  }
}
