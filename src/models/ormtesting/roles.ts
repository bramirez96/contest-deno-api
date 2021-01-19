import {
  Service,
  serviceCollection,
  Column,
  DataType,
  HasMany,
  Model,
  Primary,
} from '../../deps.ts';
import User from './users.ts';

@Model('roles')
@Service()
export default class Role {
  @Primary()
  id!: number;

  @Column({ type: DataType.String })
  role!: string;

  @HasMany(() => Role, 'roleId')
  user!: User[];
}

serviceCollection.addTransient(Role);
