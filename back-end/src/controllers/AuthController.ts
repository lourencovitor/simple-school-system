require('dotenv/config');
import knex from '../database';
import jwt from 'jsonwebtoken';
import { encrypt } from '../utils/crypto-md5';
import { NextFunction, Response, Request } from 'express';

class AuthController {
  public async store(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email, password } = req.body;
      const user_password = encrypt(password, 'hex');
      const user = await knex('users')
        .where({ email })
        .where({ password: user_password })
        .where({ 'users.deleted_at': null });
      if (user.length > 0) {
        const token = jwt.sign(
          { email: user[0].email, role: user[0].role_id },
          process.env.SECRET_API || 'e602a3f35f680b48b5d3c0e84deeddc6',
          { expiresIn: '12h' }
        );
        const data = { name: user[0].name, email: user[0].email };
        return res.json({ token, ...data });
      }
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
