import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { ChatModule } from './chat/chat.module';
import { CourseModule } from './course/course.module';
import { ProjectModule } from './project/project.module';
@Module({
  imports: [ConfigModule.forRoot(), UserModule, VacancyModule, ChatModule, CourseModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
