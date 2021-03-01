import knex from '../database';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

class ClassAtControllers {
  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const classes = await knex('classes')
        .join('teachers', 'teachers.id', '=', 'classes.teacher_id')
        .join('users', 'users.id', '=', 'teachers.user_id')
        .select('*')
        .select([
          'classes.secure_id',
          'teachers.secure_id as teacher_secure_id',
          'users.secure_id as user_secure_id',
          'classes.name as class_name',
          'users.name as user_name',
        ])
        .where({
          'classes.deleted_at': null,
        });

      const new_student = classes.map((classe: any) => {
        delete classe.password;
        return {
          id: classe.id,
          secure_id: classe.secure_id,
          teacher_id: classe.teacher_id,
          class_name: classe.class_name,
          start_date: classe.start_date,
          end_date: classe.start_date,
          created_at: classe.created_at,
          updated_at: classe.updated_at,
          deleted_at: classe.deleted_at,
          teacher: {
            user_id: classe.user_id,
            name: classe.name,
            email: classe.email,
            matter: classe.matter,
            formation: classe.formation,
            teacher_secure_id: classe.teacher_secure_id,
            user_secure_id: classe.user_secure_id,
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
      const { teacher_id, name, start_date, end_date } = req.body;
      await knex('classes').insert({
        teacher_id,
        secure_id: uuidv4(),
        name,
        start_date,
        end_date,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
  public async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const students = await knex('classes')
        .join('teachers', 'teachers.id', '=', 'classes.teacher_id')
        .join('users', 'users.id', '=', 'teachers.user_id')
        .select('*')
        .select([
          'classes.secure_id',
          'teachers.secure_id as teacher_secure_id',
          'users.secure_id as user_secure_id',
          'classes.name as class_name',
          'users.name as user_name',
        ])
        .where({
          'classes.deleted_at': null,
        });
      return res.json({
        id: students[0].id,
        secure_id: students[0].secure_id,
        teacher_id: students[0].teacher_id,
        class_name: students[0].class_name,
        start_date: students[0].start_date,
        end_date: students[0].start_date,
        created_at: students[0].created_at,
        updated_at: students[0].updated_at,
        deleted_at: students[0].deleted_at,
        teacher: {
          user_id: students[0].user_id,
          name: students[0].name,
          email: students[0].email,
          matter: students[0].matter,
          formation: students[0].formation,
          teacher_secure_id: students[0].teacher_secure_id,
          user_secure_id: students[0].user_secure_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const { name, start_date, end_date } = req.body;

      await knex('classes')
        .update({
          name,
          start_date,
          end_date,
        })
        .where({ secure_id });
      return res.send();
    } catch (error) {
      next(error);
    }
  }
  public async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const deleted_at = new Date();
      await knex('classes').update({ deleted_at }).where({ secure_id });
      return res.send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassAtControllers();
