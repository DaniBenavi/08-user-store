import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { UserModel } from '../../data/mongo/models/user.model';
import { UserEntity } from '../../domain/entities/user.entity';

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token Provided' });
    }

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await UserModel.findById(payload.id);

      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }

      req.body.user = UserEntity.fromObject(user);

      next()
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}
