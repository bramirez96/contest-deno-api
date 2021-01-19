import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Primary,
} from '../../deps.ts';
import { INewUser } from '../interfaces/users.ts';
import Role from './roles.ts';
import Validation from './validations.ts';

@Model('users')
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

  @Column({ type: DataType.Boolean })
  isValidated!: boolean;

  @Column({ type: DataType.Date, default: () => new Date().toUTCString() })
  createdAt!: Date;

  @Column({ type: DataType.Date, default: () => new Date().toUTCString() })
  updatedAt!: Date;

  @BelongsTo(() => Role, 'roleId')
  role!: Role;

  @HasMany(() => User, 'userId')
  validations!: Validation[];

  public generateFrom(body: INewUser) {
    this.age = body.age;
    this.codename = body.codename;
    this.email = body.email;
    this.parentEmail = body.parentEmail;
    this.password = body.password;
    this.roleId = body.roleId;
  }
}
