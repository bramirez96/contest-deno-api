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

@Model('resets')
@Service()
export default class Reset {
  @Primary()
  id!: number;

  @Column({ type: DataType.Boolean })
  completed!: boolean;

  @Column({ type: DataType.String })
  code!: string;

  @Column({ type: DataType.Date, default: () => new Date().toUTCString() })
  createdAt!: Date;

  @Column({ type: DataType.Date })
  expiresAt!: Date;

  @Column({ type: DataType.Number })
  userId!: number;

  @BelongsTo(() => User, 'user_reset')
  user!: User;
}

serviceCollection.addTransient(Reset);
