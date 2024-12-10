import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // await this.createDefaultAdminFirst();
    // await this.createDefaultAdminSecond();
  }

  // async createDefaultAdminFirst() {
  //   const existingAdminFirst = await this.prisma.user.findFirst({
  //     where: { name: 'adminlev' },
  //   });

  //   if (!existingAdminFirst) {
  //     const hashedPassword = await argon2.hash('qwerty');
  //     await this.prisma.user.create({
  //       data: {
  //         name: 'adminlev',
  //         password: hashedPassword,
  //         token: '',
  //         subscription: false,
  //         subBuyTime: null,
  //         subEndTime: null,
  //         role: 'Admin',
  //       },
  //     });
  //   }
  // }
  // async createDefaultAdminSecond() {
  //   const existingAdminSecond = await this.prisma.user.findFirst({
  //     where: { name: 'adminzhenya' },
  //   });
  //   const subBuyTime = new Date('2024-11-28T00:00:00.000Z');
  //   const subEndTime = new Date(subBuyTime);
  //   subEndTime.setDate(subEndTime.getDate() + 30);

  //   if (!existingAdminSecond) {
  //     const hashedPassword = await argon2.hash('qwerty2');
  //     await this.prisma.user.create({
  //       data: {
  //         name: 'adminzhenya',
  //         password: hashedPassword,
  //         token: '',
  //         subscription: true,
  //         subBuyTime: subBuyTime,
  //         subEndTime: subEndTime,
  //         role: 'Admin',
  //       },
  //     });
  //   }
  // }

  async register(
    login: string,
    password: string,
    name: string,
    role: string,
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const newUser = await this.prisma.user.create({
      data: {
        name,
        login,
        password: hashedPassword,
        token: '',
        role,
      },
    });
    return newUser;
  }
  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        courses: true, // Включаем курсы
        projects: true, // Включаем проекты
        createdVacancies: true, // Включаем созданные вакансии
        createdCourses: true, // Включаем созданные курсы
        createdProjects: true, // Включаем созданные проекты
      },
    });

    if (!user) {
      return null; // Если пользователь не найден, возвращаем null
    }

    return {
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
      role: user.role,
      courses: user.courses, // Теперь это поле доступно
      projects: user.projects, // Теперь это поле доступно
      createdVacancies: user.createdVacancies, // Теперь это поле доступно
      createdCourses: user.createdCourses, // Теперь это поле доступно
      createdProjects: user.createdProjects, // Теперь это поле доступно
    };
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        courses: true, // Включаем курсы
        projects: true, // Включаем проекты
        createdVacancies: true, // Включаем созданные вакансии
        createdCourses: true, // Включаем созданные курсы
        createdProjects: true, // Включаем созданные проекты
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
      role: user.role,
      courses: user.courses,
      projects: user.projects,
      createdVacancies: user.createdVacancies,
      createdCourses: user.createdCourses,
      createdProjects: user.createdProjects,
    }));
  }
  async updateUser(
    id: number,
    updates: {
      name?: string;
      login?: string;
      password?: string;
      profilePicture?: string;
      bio?: string;
    },
    currentPassword?: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    if (updates.password && currentPassword) {
      const passwordValid = await argon2.verify(user.password, currentPassword);
      if (!passwordValid) {
        throw new Error('Неверный текущий пароль');
      }
      updates.password = await argon2.hash(updates.password); // Хэшируем новый пароль
    }

    // Обновляем пользователя
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updates,
    });

    return updatedUser;
  }
  async findUserByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { login: login } });
  }

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.findUserByLogin(login);
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { id: user.id, name: user.name };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      return this.prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (error) {
      return null;
    }
  }

  async getUserRoleByToken(token: string): Promise<string | null> {
    const user = await this.validateToken(token);
    return user ? user.role : null;
  }
}
