import { GraphQLFormattedError } from 'graphql';
import { unwrapResolverError } from '@apollo/server/errors';

export enum StatusCodes {
  Success = 200,
  BadUserInput = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export class ServerError extends Error {
  code: number;
  additionalInfo?: string;

  constructor(message: string, code: number, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}

export const errorFormatter = (formattedError: GraphQLFormattedError, error: unknown) => {
  const originalError = unwrapResolverError(error) as ServerError;

  if (originalError?.code && originalError?.message) {
    return { code: originalError.code, message: originalError.message, additionalInfo: originalError.additionalInfo };
  }

  return { code: StatusCodes.InternalServerError, message: 'Internal server error' };
};
