import knex from '../database';
import { NextFunction, Request, Response } from 'express';
import { encrypt } from '../utils/crypto-md5';
import { v4 as uuidv4 } from 'uuid';

class TeacherController {
  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const teachers = await knex('teachers')
        .join('users', 'users.id', '=', 'teachers.user_id')
        .select('*')
        .select(['teachers.secure_id', 'users.secure_id as user_secure_id'])
        .where({
          'teachers.deleted_at': null,
        });
      const new_teachers = teachers.map((teacher: any) => {
        return {
          id: teacher.id,
          secure_id: teacher.secure_id,
          matter: teacher.matter,
          formation: teacher.formation,
          created_at: teacher.created_at,
          updated_at: teacher.updated_at,
          deleted_at: teacher.deleted_at,
          user: {
            user_id: teacher.user_id,
            user_secure_id: teacher.user_secure_id,
            name: teacher.name,
            rg: teacher.rg,
            cpf: teacher.cpf,
            gender: teacher.gender,
            dateOfBirth: teacher.dateOfBirth,
            phoneNumber: teacher.phoneNumber,
          },
        };
      });

      return res.json(new_teachers);
    } catch (error) {
      next(error);
    }
  }
  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        password,
        rg,
        cpf,
        dateOfBirth,
        phoneNumber,
        gender,
        matter,
        formation,
      } = req.body;

      const hash = encrypt(password, 'hex');
      const [user_id] = await knex('users')
        .insert({
          name,
          secure_id: uuidv4(),
          email,
          password: hash,
          rg,
          cpf,
          dateOfBirth,
          phoneNumber,
          gender,
        })
        .returning('id');
      await knex('teachers').insert({
        user_id,
        secure_id: uuidv4(),
        matter,
        formation,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
  public async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const teacher = await knex('teachers')
        .select('*')
        .select(['teachers.secure_id', 'users.secure_id as user_secure_id'])
        .join('users', 'users.id', '=', 'teachers.user_id')
        .where({ 'teachers.secure_id': secure_id })
        .where({
          'teachers.deleted_at': null,
        });
      return res.json({
        id: teacher[0].id,
        secure_id: teacher[0].secure_id,
        matter: teacher[0].matter,
        formation: teacher[0].formation,
        created_at: teacher[0].created_at,
        updated_at: teacher[0].updated_at,
        deleted_at: teacher[0].deleted_at,
        user: {
          user_id: teacher[0].user_id,
          user_secure_id: teacher[0].user_secure_id,
          name: teacher[0].name,
          rg: teacher[0].rg,
          cpf: teacher[0].cpf,
          gender: teacher[0].gender,
          dateOfBirth: teacher[0].dateOfBirth,
          phoneNumber: teacher[0].phoneNumber,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const {
        name,
        email,
        rg,
        cpf,
        dateOfBirth,
        phoneNumber,
        gender,
        matter,
        formation,
      } = req.body;

      const [user_id] = await knex('teachers')
        .update({
          matter,
          formation,
        })
        .where({ secure_id })
        .returning('user_id');
      await knex('users')
        .update({
          name,
          email,
          rg,
          cpf,
          dateOfBirth,
          phoneNumber,
          gender,
        })
        .where({ id: user_id });

      return res.send();
    } catch (error) {
      next(error);
    }
  }
  public async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const deleted_at = new Date();
      await knex('teachers').update({ deleted_at }).where({ secure_id });
      return res.send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TeacherController();
