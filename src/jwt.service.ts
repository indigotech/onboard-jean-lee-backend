import { sign, decode, JwtPayload } from 'jsonwebtoken';

const ONE_HOUR = '1h';
const ONE_WEEK = '7d';

export class JwtService {
  static sign(data, extendedExpiration?: boolean) {
    return sign({ data }, process.env.JWT_SECRET, { expiresIn: extendedExpiration ? ONE_WEEK : ONE_HOUR });
  }

  static decode(token): JwtPayload {
    return decode(token) as JwtPayload;
  }
}
