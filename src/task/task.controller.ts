import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  BadRequestException,
  HttpStatus,
  NotFoundException,
  Patch,
  Delete,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './task.model';
import { IResult } from '../interfaces/result';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<IResult<Task>> {
    try {
      console.log(req.user._id);
      const res = await this.taskService.create(createTaskDto, req.user._id);
      console.log(res);
      if (!res) {
        return new BadRequestException('create task failed').message;
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'create successfully',
        data: res,
      };
    } catch (error) {
      return new BadRequestException(error).message;
    }
  }

  @Get()
  async findAll(@Req() req: Request): Promise<IResult<Task[]>> {
    try {
      const res = await this.taskService.findAll(req.user._id, req.query);
      if (!res) {
        return new BadRequestException('fetch tasks failed').message;
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'fetch tasks successfully',
        data: res,
      };
    } catch (error) {
      return new InternalServerErrorException(error).message;
    }
  }

  @Get('/:id')
  async findById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<IResult<Task>> {
    try {
      const res = await this.taskService.findById(id, req.user._id);
      if (!res) {
        return new NotFoundException().message;
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'fetch task successfully',
        data: res,
      };
    } catch (error) {
      return new InternalServerErrorException(error).message;
    }
  }

  @Patch('/:id')
  async updateById(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<IResult<Task>> {
    try {
      const res = await this.taskService.updateById(
        id,
        updateTaskDto,
        req.user._id,
      );
      if (!res) {
        return new NotFoundException().message;
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'update task successfully',
        data: res,
      };
    } catch (error) {
      console.error(error);
    }
  }

  @Delete('/:id')
  async deleteById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<IResult<Task>> {
    try {
      const res = await this.taskService.deleteById(id, req.user._id);
      if (!res) {
        return new NotFoundException().message;
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'delete task successfully',
        data: res,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
