import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { Task } from './task.model';
import { User } from '../user/user.model';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Types } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private readonly taskModel: ModelType<Task>,
    @InjectModel(User) private readonly userModel: ModelType<User>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: Types.ObjectId,
  ): Promise<Task> {
    try {
      return await this.taskModel.create({ ...createTaskDto, userId });
    } catch (error) {
      console.error(error);
    }
  }
  async findAll(userId: Types.ObjectId, query: any): Promise<Task[]> {
    try {
      console.log(query);
      let match = {};
      let sort = {};
      if (query.completed === undefined) {
        match = { userId };
      } else {
        match = {
          userId,
          completed: query.completed === 'true',
        };
      }
      if (query.sortBy === undefined) {
        sort = { createdAt: 1 };
      } else {
        sort = {
          [query.sortBy.split(':')[0]]:
            query.sortBy.split(':')[1] === 'acs' ? 1 : -1,
        };
      }
      const user = await this.userModel
        .aggregate()
        .match({ _id: userId })
        .project({
          password: 0,
          avatar: 0,
          tokens: 0,
        })
        .lookup({
          from: 'tasks',
          as: 'tasks',
          pipeline: [
            { $match: match },
            { $sort: sort },
            {
              $skip: query.skip === undefined ? 0 : parseInt(query.limit, 10),
            },
            {
              $limit:
                query.limit === undefined ? 1000000 : parseInt(query.limit, 10),
            },
          ],
        });
      return user[0];
    } catch (error) {
      console.error(error);
    }
  }

  async findById(id: number, userId: Types.ObjectId): Promise<Task> {
    try {
      return await this.taskModel.findOne({ _id: id, userId });
    } catch (error) {
      console.error(error);
    }
  }

  async updateById(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: Types.ObjectId,
  ): Promise<Task> {
    console.log(updateTaskDto);
    try {
      const updatedProperties = Object.keys(updateTaskDto);
      const task = await this.taskModel.findOne({ _id: id, userId });
      if (!task) {
        return new NotFoundException().message;
      }
      updatedProperties.forEach(
        updatedProperty =>
          (task[updatedProperty] = updateTaskDto[updatedProperty]),
      );
      await task.save();
      return task;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteById(id: number, userId: Types.ObjectId): Promise<Task> {
    try {
      return await this.taskModel.findOneAndRemove({ _id: id, userId });
    } catch (error) {
      console.error(error);
    }
  }
}
