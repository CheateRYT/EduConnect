import { Injectable } from '@nestjs/common';
import { Project, ProjectAction } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all projects
  async getProjects(): Promise<Project[]> {
    return this.prisma.project.findMany({
      include: {
        creator: true,

        actions: {
          include: {
            user: true, // Включаем информацию о пользователе, который добавил действие
          },
        },
      },
    });
  }
  // project.service.ts
  async joinProject(projectId: number, userId: number): Promise<Project> {
    return this.prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: {
        creator: true,
        actions: true,
        users: true, // Включаем пользователей, чтобы вернуть обновленный список
      },
    });
  }
  // Create a new project
  async createProject(
    creatorId: number,
    projectData: {
      title: string;
      description?: string;
      maxParticipants: number;
    },
  ): Promise<Project> {
    return this.prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        creatorId: creatorId,
        maxParticipants: projectData.maxParticipants,
      },
    });
  }

  // Get a project by ID
  async getProjectById(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        creator: true,
        users: true,
        actions: true, // Include actions related to the project
      },
    });
  }

  // Update a project
  async updateProject(
    id: number,
    projectData: {
      title?: string;
      description?: string;
      maxParticipants?: number;
    },
  ): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: projectData,
    });
  }

  // Delete a project
  async deleteProject(id: number): Promise<Project> {
    return this.prisma.project.delete({
      where: { id: Number(id) },
    });
  }

  // Get creator ID of a project
  async getProjectCreatorId(id: number): Promise<number | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { creatorId: true },
    });
    return project ? project.creatorId : null;
  }

  // Mark project as completed
  async completeProject(id: number): Promise<Project> {
    return this.prisma.project.update({
      where: { id: Number(id) },
      data: { isCompleted: true },
    });
  }

  // Create a new action for a project
  async createProjectAction(
    projectId: number,
    userId: number,
    actionData: { title: string; description?: string; repositoryUrl?: string },
  ): Promise<ProjectAction> {
    return this.prisma.projectAction.create({
      data: {
        title: actionData.title,
        description: actionData.description,
        repositoryUrl: actionData.repositoryUrl,
        projectId: Number(projectId),
        userId: userId,
      },
    });
  }
}
