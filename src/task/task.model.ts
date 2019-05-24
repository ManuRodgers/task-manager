import { Typegoose, prop } from 'typegoose';
import { IsString, IsBoolean } from 'class-validator';

export class Task extends Typegoose {
  @IsString()
  @prop({ required: true, trim: true })
  readonly description: string;

  @IsBoolean()
  @prop({ default: false })
  readonly completed?: boolean;
}
