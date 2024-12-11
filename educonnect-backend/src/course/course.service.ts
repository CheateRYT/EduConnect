import { Injectable } from '@nestjs/common';
import { Course, Lesson } from '@prisma/client'; // Импортируйте модель Course из Prisma
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

  // Create a new lesson
  async createLesson(
    courseId: number,
    lessonData: { title: string; description?: string; videoUrl?: string },
  ): Promise<Lesson> {
    return this.prisma.lesson.create({
      data: {
        title: lessonData.title,
        description: lessonData.description,
        videoUrl: lessonData.videoUrl,
        courseId: courseId,
      },
    });
  }

  // Get all lessons for a course
  async getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      where: { courseId: courseId },
    });
  }

  // Get a lesson by ID
  async getLessonById(id: number): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
    });
  }

  // Update a lesson
  async updateLesson(
    id: number,
    lessonData: { title?: string; description?: string; videoUrl?: string },
  ): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data: lessonData,
    });
  }

  // Delete a lesson
  async deleteLesson(id: number): Promise<Lesson> {
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
