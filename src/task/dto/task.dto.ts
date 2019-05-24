import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Task } from '../task.model';

export class CreateTaskDto {
  @IsString()
  readonly description: Task['description'];

  @IsBoolean()
  @IsOptional()
  readonly completed?: Task['completed'];
}
