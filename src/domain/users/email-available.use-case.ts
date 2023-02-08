import { AppDataSource } from '../../data/data-source';
import { User } from '../../data/entity/User';

export const emailAvailableUseCase = async (email: string) => {
  const emailInUse = !!(await AppDataSource.getRepository(User).findOneBy({ email }));
  return !emailInUse;
};
