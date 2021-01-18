import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Primary,
  Service,
  serviceCollection,
} from '../../deps.ts';
import Reset from './resets.ts';
import Role from './roles.ts';
import Submission from './submissions.ts';
import Validation from './validations.ts';

@Model('users')
@Service()
export default class User {
  @Primary()
  id!: number;

  @Column({ type: DataType.String })
  codename!: string;

  @Column({ type: DataType.String })
  email!: string;

  @Column({ type: DataType.String })
  parentEmail!: string;

  @Column({ type: DataType.String })
  password!: string;

  @Column({ type: DataType.Number })
  age!: number;

  @Column({ type: DataType.Number })
  roleId!: number;

  @Column({ type: DataType.Date, default: () => new Date().toUTCString() })
  createdAt!: Date;

  @Column({ type: DataType.Date, default: () => new Date().toUTCString() })
  updatedAt!: Date;

  @BelongsTo(() => Role, 'roleId')
  role!: Role;

  @HasMany(() => User, 'userId')
  reset!: Reset[];

  @HasMany(() => User, 'userId')
  validations!: Validation[];

  @HasMany(() => User, 'userId')
  submission!: Submission[];
}

serviceCollection.addTransient(User);
