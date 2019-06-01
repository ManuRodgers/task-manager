import { Typegoose, prop, Ref } from 'typegoose';
import { IsString, IsBoolean } from 'class-validator';
import { User } from '../user/user.model';

export class Task extends Typegoose {
  @IsString()
  @prop({ required: true, trim: true })
  readonly description!: string;

  @prop({ ref: User, required: true })
  readonly userId: Ref<User>;

  @IsBoolean()
  @prop({ default: false })
  readonly completed?: boolean;
}
