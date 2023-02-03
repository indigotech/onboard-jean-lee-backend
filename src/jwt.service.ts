import { sign, decode, verify, JwtPayload } from 'jsonwebtoken';

const ONE_HOUR = '1h';
const ONE_WEEK = '7d';

export class JwtService {
  static sign(data, extendedExpiration?: boolean) {
    return sign({ data }, process.env.JWT_SECRET, { expiresIn: extendedExpiration ? ONE_WEEK : ONE_HOUR });
  }

  static validate(token) {
    try {
      const verifiedToken = verify(token, process.env.JWT_SECRET) as JwtPayload;

      return !!verifiedToken.data?.id;
    } catch (e) {
      return false;
    }
  }

  static decode(token): JwtPayload {
    return decode(token) as JwtPayload;
  }
}
