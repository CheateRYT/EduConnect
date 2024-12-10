import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { VacancyService } from './vacancy.service';

@Controller('vacancy')
export class VacancyController {
  constructor(
    private readonly vacancyService: VacancyService,
    private readonly userService: UserService, // Добавляем UserService в конструктор
  ) {}

  // Получение всех вакансий
  @Get()
  async getVacancies() {
    return this.vacancyService.getVacancies();
  }

  // Создание новой вакансии
  @Post()
  async createVacancy(
    @Request() req,
    @Body() vacancyData: { title: string; description?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token); // Используем UserService для валидации токена
    if (!user || user.role !== 'EMPLOYER') {
      throw new UnauthorizedException(
        'Недостаточно прав для создания вакансии',
      );
    }
    return this.vacancyService.createVacancy(user.id, vacancyData);
  }

  // Получение вакансии по ID
  @Get(':id')
  async getVacancy(@Param('id') id: number) {
    const vacancy = await this.vacancyService.getVacancyById(id);
    if (!vacancy) {
      throw new Error('Вакансия не найдена');
    }
    return vacancy;
  }

  // Обновление вакансии
  @Put(':id')
  async updateVacancy(
    @Param('id') id: number,
    @Body() vacancyData: { title?: string; description?: string },
  ) {
    return this.vacancyService.updateVacancy(id, vacancyData);
  }

  // Удаление вакансии
  @Delete(':id')
  async deleteVacancy(@Param('id') id: number) {
    return this.vacancyService.deleteVacancy(id);
  }
}
