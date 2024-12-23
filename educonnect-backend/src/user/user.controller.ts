import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body('login') login: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('role') role: string,
    @Body('company') company?: string,
  ) {
    return this.userService.register(login, password, name, role, company);
  }
  @Post('recommendation')
  async createRecommendation(
    @Request() req,
    @Body('recipientId') recipientId: number,
    @Body('title') title: string,
    @Body('description') description?: string,
    @Body('rating') rating?: number,
  ) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
    const user = await this.userService.validateToken(token); // Проверяем токен
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }

    // Проверяем, что отправитель имеет роль TEACHER
    if (user.role !== 'TEACHER') {
      throw new UnauthorizedException(
        'У вас нет прав для создания рекомендаций',
      );
    }

    try {
      // Создаем рекомендацию
      const recommendation = await this.userService.createRecommendation(
        Number(user.id),
        recipientId,
        title,
        description,
        Number(rating),
      );
      return { recommendation };
    } catch (error) {
      throw new Error(`Ошибка при создании рекомендации: ${error.message}`);
    }
  }
  @Post('update')
  async updateUser(
    @Request() req,
    @Body()
    updates: {
      name?: string;
      login?: string;
      password?: string;
      profilePicture?: string;
      bio?: string;
      company?: string;
      role?: string; // Добавляем роль
    },
    @Body('currentPassword') currentPassword?: string,
  ) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
    const user = await this.userService.validateToken(token); // Проверяем токен
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }
    const updatedUser = await this.userService.updateUser(
      user.id,
      updates,
      currentPassword,
    );
    if (!updatedUser) {
      throw new Error('Не найден пользователь');
    }
    return { user: updatedUser };
  }

  // @Get('/:id')
  // async getUser(@Param('id') id: number, @Request() req) {
  //   const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
  //   const user = await this.userService.validateToken(token); // Проверяем токен
  //   if (!user) {
  //     throw new UnauthorizedException('Неверный токен'); // Если токен недействителен, выбрасываем исключение
  //   }

  //   const foundUser = await this.userService.getUser(Number(id));
  //   if (!foundUser) {
  //     throw new Error('Не найден пользователь');
  //   }
  //   return { user: foundUser };
  // }

  @Get('getUser/:id')
  async getUser(@Request() req, @Param('id') id: string) {
    // Измените тип на string
    const userId = parseInt(id, 10); // Преобразуем id в число
    const user = await this.userService.getUserNew(userId); // Получаем пользователя
    return { user: user }; // Возвращаем пользователя
  }
  @Get('recommendations')
  async getRecommendations(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
    console.log(token);
    const user = await this.userService.validateToken(token); // Проверяем токен
    if (!user) {
      throw new UnauthorizedException(`Неверный токен ${token} `); // Если токен недействителен, выбрасываем исключение
    }
    const recommendations = await this.userService.getRecommendations(user.id); // Получаем рекомендации для пользователя
    return { recommendations }; // Возвращаем рекомендации
  }
  @Get('recommendations/:id')
  async getRecommendationsById(@Param('id') id: number) {
    const recommendations = await this.userService.getRecommendations(
      Number(id),
    );
    return { recommendations };
  }
  @Get('/')
  async getUsers(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
    const user = await this.userService.validateToken(token); // Проверяем токен
    if (!user) {
      throw new UnauthorizedException('Неверный токен'); // Если токен недействителен, выбрасываем исключение
    }
    return this.userService.getUsers(); // Получаем всех пользователей
  }

  @Get('validate-token')
  async validateToken(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return { valid: false };
    }
    const user = await this.userService.validateToken(token);
    return { valid: !!user, user };
  }

  @Post('login')
  async login(
    @Body('login') login: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.validateUser(login, password);
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }
    const token = await this.userService.generateToken(user);
    return { message: 'Успешный вход', user, token };
  }
}
