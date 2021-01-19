import {
  Column,
  DataType,
  HasMany,
  Model,
  Primary,
  Service,
  serviceCollection,
} from '../../../deps.ts';
import Submission from './submissions.ts';

@Model('prompts')
export default class Prompt {
  @Primary()
  id!: number;

  @Column({ type: DataType.String })
  prompt!: string;

  @Column({ type: DataType.Boolean })
  active!: boolean;

  @HasMany(() => Prompt, 'promptId')
  submission!: Submission[];
}
