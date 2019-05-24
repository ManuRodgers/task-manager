import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private readonly taskModel: ModelType<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskModel.create(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskModel.find().exec();
  }
}
