import { IUserSignup } from '../interfaces/user.ts';
import events from './events.ts';

export const onUserSignUp = ({ email, codename, password }: IUserSignup) => {};

export const onUserSignIn = (id: number) => {};
