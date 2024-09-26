import { Types } from 'mongoose';
import { errorBody } from '@src/utils/infinity-response';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

export function isValidMongoId(id: string | undefined): boolean {
  if (!!id) {
    return (
      Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id
    );
  }
  return false;
}

export function toMongoId(id: string | undefined): Types.ObjectId {
  try {
    return new Types.ObjectId(id);
  } catch (e) {
    console.log(e);
    throw new BadRequestException(errorBody('switch to mongo id error'));
  }
}

export function formatErrors(errors: any[]): string {
  return errors
    .map((err) => Object.values(err.constraints).join(', '))
    .join('; ');
}
