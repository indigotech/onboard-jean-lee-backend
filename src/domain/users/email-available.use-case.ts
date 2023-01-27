import { AppDataSource } from '../../data-source';
import { User } from '../../entity/User';

export const emailAvailableUseCase = async (email: string) => {
  const emailInUse = !!(await AppDataSource.getRepository(User).findOneBy({ email }));
  return !emailInUse;
};
