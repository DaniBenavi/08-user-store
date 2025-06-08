import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  static async generateToken(
    payload: any,
    duration: SignOptions['expiresIn'] = '2h'
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const options: SignOptions = {
        expiresIn: duration,
      };

      jwt.sign(payload, JWT_SEED, options, (err, token) => {
        if (err || !token) {
          return resolve(null);
        }

        resolve(token);
      });
    });
  }

  static validateToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) {
          return resolve(null);
        }

        resolve(decoded);
      });
    });
  }
}
