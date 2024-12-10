import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // Получение всех проектов
  async getProjects(): Promise<Project[]> {
    return this.prisma.project.findMany({
      include: {
        creator: true, // Включаем информацию о создателе проекта
      },
    });
  }

  // Создание нового проекта
  async createProject(
    creatorId: number,
    projectData: { title: string; description?: string },
  ): Promise<Project> {
    return this.prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        creatorId: creatorId,
      },
    });
  }

  // Получение проекта по ID
  async getProjectById(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        creator: true, // Включаем информацию о создателе проекта
      },
    });
  }

  // Обновление проекта
  async updateProject(
    id: number,
    projectData: { title?: string; description?: string },
  ): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: projectData,
    });
  }

  // Удаление проекта
  async deleteProject(id: number): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  // Получение ID создателя проекта
  async getProjectCreatorId(id: number): Promise<number | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { creatorId: true },
    });
    return project ? project.creatorId : null;
  }
}
