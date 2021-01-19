import { Service, serviceCollection } from '../../deps.ts';
import { INewUser, IUser } from '../interfaces/users.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class UserModel extends BaseModel<INewUser, IUser> {
  constructor() {
    super('users');
  }
}

serviceCollection.addTransient(UserModel);
