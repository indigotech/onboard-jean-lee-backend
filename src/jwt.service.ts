import { sign, decode, JwtPayload } from 'jsonwebtoken';

const ONE_HOUR = '1h';

export class JwtService {
  static sign(data) {
    return sign({ data }, process.env.JWT_SECRET, { expiresIn: ONE_HOUR });
  }

  static decode(token): JwtPayload {
    return decode(token) as JwtPayload;
  }
}
