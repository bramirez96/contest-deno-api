import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Primary,
  Service,
  serviceCollection,
} from '../../deps.ts';
import Prompt from './prompts.ts';
import User from './users.ts';

@Model('submissions')
@Service()
export default class Submission {
  @Primary()
  id!: number;

  @Column({ type: DataType.String })
  s3Label!: string;

  @Column({ type: DataType.Number })
  confidence!: number;

  @Column({ type: DataType.Number })
  dsScore!: number;

  @Column({ default: 0, type: DataType.Number })
  rotation!: number;

  @Column({ default: new Date().toUTCString(), type: DataType.Date })
  createdAt!: Date;

  @Column({ type: DataType.Number })
  userId!: number;

  @Column({ type: DataType.Number })
  promptId!: number;

  @BelongsTo(() => User, 'user_sub')
  user!: User;

  @BelongsTo(() => Prompt, 'promptId')
  prompt!: Prompt;
}

serviceCollection.addTransient(Submission);
