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

  // Create a new lesson
  @Post(':courseId/lesson')
  async createLesson(
    @Request() req,
    @Param('courseId') courseId: number,
    @Body()
    lessonData: { title: string; description?: string; videoUrl?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user || user.role !== 'TEACHER') {
      throw new UnauthorizedException('Недостаточно прав для создания урока');
    }
    return this.courseService.createLesson(courseId, lessonData);
  }

  // Get all lessons for a course
  @Get(':courseId/lesson')
  async getLessons(@Param('courseId') courseId: number) {
    return this.courseService.getLessonsByCourseId(courseId);
  }

  // Get a lesson by ID
  @Get(':courseId/lesson/:id')
  async getLesson(@Param('id') id: number) {
    const lesson = await this.courseService.getLessonById(id);
    if (!lesson) {
      throw new Error('Урок не найден');
    }
    return lesson;
  }

  // Update a lesson
  @Put(':courseId/lesson/:id')
  async updateLesson(
    @Request() req,
    @Param('id') id: number,
    @Body()
    lessonData: { title?: string; description?: string; videoUrl?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }
    // Here you could add additional checks if necessary
    return this.courseService.updateLesson(id, lessonData);
  }

  // Delete a lesson
  @Delete(':courseId/lesson/:id')
  async deleteLesson(@Request() req, @Param('id') id: number) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }
    // Here you could add additional checks if necessary
    return this.courseService.deleteLesson(id);
  }
}
