import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, UserService, PrismaService],
})
export class CourseModule {}
