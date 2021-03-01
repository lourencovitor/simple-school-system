import knex from '../database';
import { NextFunction, Request, Response } from 'express';
import { encrypt } from '../utils/crypto-md5';
import { v4 as uuidv4 } from 'uuid';

class StudentController {
  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const students = await knex('students')
        .join('users', 'users.id', '=', 'students.user_id')
        .select('*')
        .select(['students.secure_id', 'users.secure_id as user_secure_id'])
        .where({
          'students.deleted_at': null,
        });
      const new_student = students.map((student: any) => {
        return {
          id: student.id,
          secure_id: student.secure_id,
          age: student.age,
          interest_area: student.interest_area,
          created_at: student.created_at,
          updated_at: student.updated_at,
          deleted_at: student.deleted_at,
          user: {
            user_id: student.user_id,
            user_secure_id: student.user_secure_id,
            name: student.name,
            rg: student.rg,
            cpf: student.cpf,
            gender: student.gender,
            dateOfBirth: student.dateOfBirth,
            phoneNumber: student.phoneNumber,
          },
        };
      });

      return res.json(new_student);
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
        age,
        interest_area,
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
      await knex('students').insert({
        user_id,
        secure_id: uuidv4(),
        age,
        interest_area,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
  public async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const students = await knex('students')
        .select('*')
        .select(['students.secure_id', 'users.secure_id as user_secure_id'])
        .join('users', 'users.id', '=', 'students.user_id')
        .where({ 'students.secure_id': secure_id })
        .where({
          'students.deleted_at': null,
        });
      delete students[0].password;
      return res.json({
        id: students[0].id,
        secure_id: students[0].secure_id,
        age: students[0].age,
        interest_area: students[0].interest_area,
        created_at: students[0].created_at,
        updated_at: students[0].updated_at,
        deleted_at: students[0].deleted_at,
        user: {
          user_id: students[0].user_id,
          user_secure_id: students[0].user_secure_id,
          name: students[0].name,
          rg: students[0].rg,
          cpf: students[0].cpf,
          gender: students[0].gender,
          dateOfBirth: students[0].dateOfBirth,
          phoneNumber: students[0].phoneNumber,
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
        age,
        interest_area,
      } = req.body;

      const [user_id] = await knex('students')
        .update({
          age,
          interest_area,
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
      await knex('students').update({ deleted_at }).where({ secure_id });
      return res.send();
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();
