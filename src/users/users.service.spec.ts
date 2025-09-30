import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService - Testes Unitários', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  const createUserDto = {
    name: 'New User',
    email: 'new@example.com',
    password: 'password123',
    role: 'user',
  };

  // Mock user sem senha (como o service retorna)
  const mockUser = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
    googleId: null,
    photoURL: null,
    isGoogleUser: false,
  };

  // Mock user com senha (como o Prisma retorna)
  const mockUserWithPassword = {
    ...mockUser,
    password: '$2b$10$hashedpassword',
  };

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar um usuário por ID', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);

      // Act
      const result = await usersService.findOne('user123');

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user123' },
      });
      expect(result).toEqual(mockUser); // Sem senha
    });

    it('deve lançar NotFoundException para usuário inexistente', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(usersService.findOne('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue([mockUserWithPassword]);

      // Act
      const result = await usersService.findAll({});

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: {},
      });
      expect(result).toEqual([mockUser]); // Sem senha
    });

    it('deve filtrar por role', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue([mockUserWithPassword]);

      // Act
      await usersService.findAll({ role: 'admin' });

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: 'admin' },
        orderBy: {},
      });
    });

    it('deve filtrar por nome', async () => {
      // Arrange
      mockPrismaService.user.findMany.mockResolvedValue([mockUserWithPassword]);

      // Act
      await usersService.findAll({ name: 'test' });

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'test' } },
        orderBy: {},
      });
    });
  });

  describe('create', () => {
    it('deve criar usuário com sucesso', async () => {
      // Arrange
      const bcrypt = require('bcrypt');
      const hashedPassword = '$2b$10$hashedpassword';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUserWithPassword);

      // Act
      const result = await usersService.create(createUserDto);

      // Assert
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toEqual(mockUser); // Sem senha
    });

    it('deve lançar BadRequestException para email duplicado', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);

      // Act & Assert
      await expect(
        usersService.create(createUserDto)
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lidar com erro na criação', async () => {
      // Arrange
      const bcrypt = require('bcrypt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(usersService.create(createUserDto)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('update', () => {
    it('deve atualizar usuário com sucesso', async () => {
      // Arrange
      const updateDto = { name: 'Updated Name' };
      const updatedUserWithPassword = { ...mockUserWithPassword, name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);
      mockPrismaService.user.update.mockResolvedValue(updatedUserWithPassword);

      // Act
      const result = await usersService.update('user123', updateDto);

      // Assert
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: updateDto,
      });
      expect(result).toEqual(updatedUser); // Sem senha
    });

    it('deve lançar NotFoundException para usuário inexistente', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        usersService.update('nonexistent', { name: 'Test' })
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar senha com hash', async () => {
      // Arrange
      const bcrypt = require('bcrypt');
      const hashedPassword = '$2b$10$newhashedpassword';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);
      mockPrismaService.user.update.mockResolvedValue(mockUserWithPassword);

      // Act
      await usersService.update('user123', { password: 'newpassword' });

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });
  });

  describe('remove', () => {
    it('deve remover usuário com sucesso', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);
      mockPrismaService.user.delete.mockResolvedValue(mockUserWithPassword);

      // Act
      const result = await usersService.remove('user123');

      // Assert
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user123' },
      });
      expect(result).toEqual(mockUserWithPassword); // Remove retorna o usuário original
    });

    it('deve lançar NotFoundException para usuário inexistente', async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(usersService.remove('nonexistent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findInactiveUsers', () => {
    it('deve retornar usuários inativos', async () => {
      // Arrange
      const inactiveUsers = [mockUserWithPassword];
      mockPrismaService.user.findMany.mockResolvedValue(inactiveUsers);

      // Act
      const result = await usersService.findInactiveUsers();

      // Assert
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { lastLogin: null },
            { lastLogin: { lt: expect.any(Date) } },
          ],
        },
      });
      expect(result).toEqual([mockUser]); // Sem senha
    });
  });

  describe('Testes de Segurança', () => {
    it('deve fazer hash da senha antes de salvar', async () => {
      // Arrange
      const bcrypt = require('bcrypt');
      const plainPassword = 'plainPassword';
      const hashedPassword = '$2b$10$hashedpassword';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      const createDto = { ...createUserDto, password: plainPassword };
      // Simular que não há usuário com o email
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUserWithPassword);

      // Act
      await usersService.create(createDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });
  });
});