import { Router } from 'express';
import AuthController from './controllers/AuthController';
import TeacherController from './controllers/TeacherController';
import StudentController from './controllers/StudentController';
import ClassAtControllers from './controllers/ClassAtController';
import ClassesStudentController from './controllers/ClassesStudentController';

const routes = Router();

routes.post('/auth', AuthController.store);

// Teachers
routes.post('/teachers', TeacherController.store);
routes.get('/teachers', TeacherController.index);
routes.get('/teachers/:secure_id', TeacherController.show);
routes.put('/teachers/:secure_id', TeacherController.update);
routes.delete('/teachers/:secure_id', TeacherController.destroy);

// Students
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.get('/students/:secure_id', StudentController.show);
routes.put('/students/:secure_id', StudentController.update);
routes.delete('/students/:secure_id', StudentController.destroy);

// Classes
routes.post('/classes', ClassAtControllers.store);
routes.get('/classes', ClassAtControllers.index);
routes.get('/classes/:secure_id', ClassAtControllers.show);
routes.put('/classes/:secure_id', ClassAtControllers.update);
routes.delete('/classes/:secure_id', ClassAtControllers.destroy);

// Classes Student
routes.post('/classes-student', ClassesStudentController.store);
routes.get('/classes-student', ClassesStudentController.index);
routes.get('/classes-student/:class_id', ClassesStudentController.show);
routes.put('/classes-student/:secure_id', ClassesStudentController.update);
routes.delete('/classes-student/:secure_id', ClassesStudentController.destroy);

export default routes;
