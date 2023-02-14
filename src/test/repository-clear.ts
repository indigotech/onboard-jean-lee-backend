import { EntityTarget } from 'typeorm';
import { AppDataSource } from '../data/data-source';

const getDeleteStatement = (table: string) => `
    ALTER TABLE "${table}" DISABLE TRIGGER ALL;
    DELETE FROM "${table}";
    ALTER TABLE "${table}" ENABLE TRIGGER ALL;`;

export const clearRepository = async (entity: EntityTarget<unknown>) => {
  const deleteStatement = getDeleteStatement(AppDataSource.getMetadata(entity).tableName);
  await AppDataSource.query(deleteStatement);
};
