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
        actions: true,
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
      where: { id },
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
      where: { id },
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
        projectId: projectId,
        userId: userId,
      },
    });
  }
}
