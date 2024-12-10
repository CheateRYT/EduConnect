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
  ) {
    return this.userService.register(login, password, name, role);
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

  @Get('/:id')
  async getUser(@Param('id') id: number, @Request() req) {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
    const user = await this.userService.validateToken(token); // Проверяем токен
    if (!user) {
      throw new UnauthorizedException('Неверный токен'); // Если токен недействителен, выбрасываем исключение
    }

    const foundUser = await this.userService.getUser(Number(id));
    if (!foundUser) {
      throw new Error('Не найден пользователь');
    }
    return { user: foundUser };
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
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка
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
