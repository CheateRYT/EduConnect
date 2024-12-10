// course.controller.ts
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
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  // Получение всех курсов
  @Get()
  async getCourses() {
    return this.courseService.getCourses();
  }

  // Создание нового курса
  @Post()
  async createCourse(
    @Request() req,
    @Body() courseData: { title: string; description?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user || user.role !== 'TEACHER') {
      throw new UnauthorizedException('Недостаточно прав для создания курса');
    }
    return this.courseService.createCourse(user.id, courseData);
  }

  // Получение курса по ID
  @Get(':id')
  async getCourse(@Param('id') id: number) {
    const course = await this.courseService.getCourseById(id);
    if (!course) {
      throw new Error('Курс не найден');
    }
    return course;
  }

  // Обновление курса
  @Put(':id')
  async updateCourse(
    @Request() req,
    @Param('id') id: number,
    @Body() courseData: { title?: string; description?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }

    // Проверяем, является ли пользователь создателем курса
    const creatorId = await this.courseService.getCourseCreatorId(id);
    if (creatorId !== user.id) {
      throw new UnauthorizedException('Вы не можете обновить этот курс');
    }

    return this.courseService.updateCourse(id, courseData);
  }

  // Удаление курса
  @Delete(':id')
  async deleteCourse(@Request() req, @Param('id') id: number) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }

    // Проверяем, является ли пользователь создателем курса
    const creatorId = await this.courseService.getCourseCreatorId(id);
    if (creatorId !== user.id) {
      throw new UnauthorizedException('Вы не можете удалить этот курс');
    }

    return this.courseService.deleteCourse(id);
  }
}
