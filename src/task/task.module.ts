import { Module, HttpModule } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Task } from './task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypegooseModule.forFeature(Task), HttpModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
