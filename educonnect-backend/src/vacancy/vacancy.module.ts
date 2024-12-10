import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';

@Module({
  controllers: [VacancyController],
  providers: [VacancyService, PrismaService, UserService],
})
export class VacancyModule {}
