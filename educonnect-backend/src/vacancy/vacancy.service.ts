import { Injectable } from '@nestjs/common';
import { Vacancy } from '@prisma/client'; // Импортируйте модель Vacancy из Prisma
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class VacancyService {
  constructor(private readonly prisma: PrismaService) {}

  // Получение всех вакансий
  async getVacancies(): Promise<Vacancy[]> {
    return this.prisma.vacancy.findMany();
  }

  // Создание новой вакансии
  async createVacancy(
    employerId: number,
    vacancyData: { title: string; description?: string },
  ): Promise<Vacancy> {
    return this.prisma.vacancy.create({
      data: {
        title: vacancyData.title,
        description: vacancyData.description,
        employerId: employerId,
      },
    });
  }

  // Получение вакансии по ID
  async getVacancyById(id: number): Promise<Vacancy | null> {
    return this.prisma.vacancy.findUnique({
      where: { id },
    });
  }

  // Обновление вакансии
  async updateVacancy(
    id: number,
    vacancyData: { title?: string; description?: string },
  ): Promise<Vacancy> {
    return this.prisma.vacancy.update({
      where: { id },
      data: vacancyData,
    });
  }

  // Удаление вакансии
  async deleteVacancy(id: number): Promise<Vacancy> {
    return this.prisma.vacancy.delete({
      where: { id },
    });
  }
}
