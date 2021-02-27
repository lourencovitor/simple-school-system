import knex from '../database';
import { NextFunction, Request, Response } from 'express';
import { UserInterface } from '../interfaces/User';
import { encrypt } from '../utils/crypto-md5';

class UserController {
  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const users = await knex('users').where({ 'users.deleted_at': null });

      const new_users = users.map((user: UserInterface) => {
        return {
          ...user,
        };
      });

      return res.json(new_users);
    } catch (error) {
      next(error);
    }
  }
  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, role_id, email, password } = req.body;
      const hash = encrypt(password, 'hex');
      await knex('users').insert({
        role_id: role_id ? role_id : 2,
        name,
        email,
        password: hash,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
  //   public async show(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { id } = req.params;
  //       const role = await knex('users').where({ 'users.id': id });
  //       delete role[0].password;
  //       return res.json(role);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //   public async update(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { id } = req.params;
  //       const { name, email, password } = req.body;
  //       const hash = md5(password, 'hex');
  //       await knex('users')
  //         .update({
  //           name,
  //           email,
  //           password: hash,
  //         })
  //         .where({ id });
  //       return res.send();
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //   public async destroy(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const { id } = req.params;
  //       const deleted_at = new Date();
  //       await knex('users').update({ deleted_at }).where({ id });
  //       return res.send();
  //     } catch (error) {
  //       next(error);
  //     }
  //   },
}

export default new UserController();
