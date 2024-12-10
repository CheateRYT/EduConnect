import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client'; // Импортируйте модель Course из Prisma
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  // Получение всех курсов
  async getCourses(): Promise<Course[]> {
    return this.prisma.course.findMany();
  }

  // Создание нового курса
  async createCourse(
    creatorId: number,
    courseData: { title: string; description?: string },
  ): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        creatorId: creatorId,
      },
    });
  }
  // course.service.ts
  async getCourseCreatorId(id: number): Promise<number | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: { creatorId: true }, // Получаем только creatorId
    });
    return course ? course.creatorId : null;
  }
  // Получение курса по ID
  async getCourseById(id: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }

  // Обновление курса
  async updateCourse(
    id: number,
    courseData: { title?: string; description?: string },
  ): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data: courseData,
    });
  }

  // Удаление курса
  async deleteCourse(id: number): Promise<Course> {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
