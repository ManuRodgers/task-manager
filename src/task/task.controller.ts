import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpService,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task.dto';
import { Task } from './task.model';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }
}
