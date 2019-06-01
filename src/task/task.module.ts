import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Task } from './task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypegooseModule.forFeature({
      typegooseClass: Task,
      schemaOptions: {
        collection: 'tasks',
        timestamps: true,
      },
    }),
    AuthModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
