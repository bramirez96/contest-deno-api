import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Primary,
  Service,
  serviceCollection,
} from '../../deps.ts';
import User from './users.ts';

@Model('validations')
@Service()
export default class Validation {
  @Primary()
  id!: number;

  @Column({ type: DataType.String })
  code!: string;

  @Column({ default: () => new Date().toUTCString(), type: DataType.Date })
  createdAt!: Date;

  @Column({ type: DataType.Number })
  userId!: number;

  @BelongsTo(() => User, 'id')
  user!: User;
}

serviceCollection.addTransient(Validation);
