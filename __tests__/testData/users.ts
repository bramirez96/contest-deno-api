import { INewUser } from '../../src/interfaces/users.ts';
import { v5 } from '../../testDeps.ts';

const valid: INewUser[] = [
  {
    codename: 'TestCodename1',
    email: 'someemail1@email.com',
    firstname: 'Firstname1',
    lastname: 'Lastname1',
    password: 'somepass123A',
    age: 24,
    parentEmail: 'parentEmail1@email.com',
  },
  {
    codename: 'TestCodename2',
    email: 'someemail2@email.com',
    firstname: 'Firstname2',
    lastname: 'Lastname2',
    password: 'somepass123A',
    age: 24,
    parentEmail: 'parentEmail2@email.com',
  },
];

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

const newPass = 'newPassword123';
const wrongCode = v5.generate({
  namespace: '6d16c1e3-753f-4909-8d37-d7a84aaba291', // DONT MAKE THE SAME AS ENV NAMESPACE
  value: 'someValue',
});

export default { valid, incomplete, tooYoung, newPass, wrongCode };
