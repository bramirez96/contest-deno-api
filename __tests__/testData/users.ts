import { INewUser } from '../../src/interfaces/users.ts';

const valid: INewUser = {
  codename: 'TestCodename1',
  email: 'someemail1@email.com',
  firstname: 'Firstname1',
  lastname: 'Lastname1',
  password: 'somepass123A',
  age: 24,
  parentEmail: 'parentEmail1@email.com',
};

const incomplete: Partial<INewUser> = {
  email: 'justanemail@email.com',
};

const tooYoung: INewUser = {
  codename: 'ChildCodename',
  email: 'someEmail@email.com',
  parentEmail: 'someEmail@email.com',
  firstname: 'Firstname1',
  lastname: 'Lastname1',
  password: 'somepass123A',
  age: 10,
};

export default { valid, incomplete, tooYoung };
