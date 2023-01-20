import { AppDataSource } from './data-source';
import { User } from './entity/User';

export const passwordValidator = (password: string) => {
  if (password.length < 6) {
    return false;
  }

  if (!/[a-z]|[A-Z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  return true;
};

export const emailValidator = async (email: string) => {
  const emailInUse = !!(await AppDataSource.getRepository(User).findOneBy({ email }));
  return !emailInUse;
};
