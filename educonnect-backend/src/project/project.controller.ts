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
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  // Получение всех проектов
  @Get()
  async getProjects() {
    return this.projectService.getProjects();
  }

  // Создание нового проекта
  @Post()
  async createProject(
    @Request() req,
    @Body() projectData: { title: string; description?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }
    return this.projectService.createProject(user.id, projectData);
  }

  // Получение проекта по ID
  @Get(':id')
  async getProject(@Param('id') id: number) {
    const project = await this.projectService.getProjectById(id);
    if (!project) {
      throw new Error('Проект не найден');
    }
    return project;
  }

  // Обновление проекта
  @Put(':id')
  async updateProject(
    @Request() req,
    @Param('id') id: number,
    @Body() projectData: { title?: string; description?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }

    // Проверяем, является ли пользователь создателем проекта
    const creatorId = await this.projectService.getProjectCreatorId(id);
    if (creatorId !== user.id) {
      throw new UnauthorizedException('Вы не можете обновить этот проект');
    }

    return this.projectService.updateProject(id, projectData);
  }

  // Удаление проекта
  @Delete(':id')
  async deleteProject(@Request() req, @Param('id') id: number) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Неверный токен');
    }

    // Проверяем, является ли пользователь создателем проекта
    const creatorId = await this.projectService.getProjectCreatorId(id);
    if (creatorId !== user.id) {
      throw new UnauthorizedException('Вы не можете удалить этот проект');
    }

    return this.projectService.deleteProject(id);
  }
}
