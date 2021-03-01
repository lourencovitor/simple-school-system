import knex from '../database';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

class ClassesStudentControllers {
  public async index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const classes_student = await knex('classes_student').where({
        'classes_student.deleted_at': null,
      });
      return res.json(classes_student);
    } catch (error) {
      next(error);
    }
  }
  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { class_id, student_id, status } = req.body;
      await knex('classes_student').insert({
        secure_id: uuidv4(),
        class_id,
        student_id,
        status,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
  public async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { class_id } = req.params;
      const classes_student = await knex('classes_student')
        .join('classes', 'classes.id', '=', 'classes_student.class_id')
        .join('teachers', 'teachers.id', '=', 'classes.teacher_id')
        .join('students', 'students.id', '=', 'classes_student.student_id')
        .join(
          'users as user_teacher',
          'user_teacher.id',
          '=',
          'teachers.user_id'
        )
        .join(
          'users as user_student',
          'user_student.id',
          '=',
          'students.user_id'
        )
        .select('*')
        .select(
          'user_teacher.name as teacher_name',
          'user_student.name as student_name',
          'classes_student.secure_id as secure_id',
          'teachers.secure_id as teacher_secure_id',
          'user_teacher.secure_id as user_secure_id'
        )
        .where({ 'classes_student.class_id': class_id })
        .where({
          'classes_student.deleted_at': null,
        });
      const classes_students = classes_student.map((classes_student: any) => {
        return {
          id: classes_student.id,
          secure_id: classes_student.secure_id,
          class_id: classes_student.class_id,
          student_id: classes_student.student_id,
          status: classes_student.status,
          created_at: classes_student.created_at,
          updated_at: classes_student.updated_at,
          deleted_at: classes_student.deleted_at,
          teacher: {
            name: classes_student.teacher_name,
            matter: classes_student.matter,
            formation: classes_student.formation,
          },
          student: {
            name: classes_student.student_name,
            age: classes_student.age,
            interest_area: classes_student.interest_area,
          },
        };
      });
      return res.json(classes_students);
    } catch (error) {
      next(error);
    }
  }
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { secure_id } = req.params;
      const { status } = req.body;

      await knex('classes_student')
        .update({
          status,
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
      await knex('classes_student').update({ deleted_at }).where({ secure_id });
      return res.send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassesStudentControllers();
