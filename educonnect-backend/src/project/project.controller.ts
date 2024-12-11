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

  // Get all projects
  @Get()
  async getProjects() {
    return this.projectService.getProjects();
  }

  // Create a new project
  @Post()
  async createProject(
    @Request() req,
    @Body()
    projectData: {
      title: string;
      description?: string;
      maxParticipants: number;
    },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    if (user.role == 'STUDENT')
      throw new Error('Студент не может создать проект');
    return this.projectService.createProject(user.id, projectData);
  }

  // Get a project by ID
  @Get(':id')
  async getProject(@Param('id') id: number) {
    const project = await this.projectService.getProjectById(Number(id));
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  // Update a project
  @Put(':id')
  async updateProject(
    @Request() req,
    @Param('id') id: number,
    @Body()
    projectData: {
      title?: string;
      description?: string;
      maxParticipants?: number;
    },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const creatorId = await this.projectService.getProjectCreatorId(Number(id));
    if (creatorId !== user.id) {
      throw new UnauthorizedException('You cannot update this project');
    }
    return this.projectService.updateProject(id, projectData);
  }

  // Delete a project
  @Delete(':id')
  async deleteProject(@Request() req, @Param('id') id: number) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const creatorId = await this.projectService.getProjectCreatorId(Number(id));
    if (creatorId !== user.id) {
      throw new UnauthorizedException('You cannot delete this project');
    }
    return this.projectService.deleteProject(id);
  }

  // Complete a project
  @Put(':id/complete')
  async completeProject(@Request() req, @Param('id') id: number) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const creatorId = await this.projectService.getProjectCreatorId(Number(id));
    if (creatorId !== user.id) {
      throw new UnauthorizedException('You cannot complete this project');
    }
    return this.projectService.completeProject(id);
  }

  // Create a new action for a project
  @Post(':projectId/action')
  async createProjectAction(
    @Request() req,
    @Param('projectId') projectId: number,
    @Body()
    actionData: { title: string; description?: string; repositoryUrl?: string },
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.projectService.createProjectAction(
      projectId,
      user.id,
      actionData,
    );
  }
}
