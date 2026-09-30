import { StudentRepository } from '../repositories/StudentRepository.js';
import jwt from 'jsonwebtoken';

export class StudentService {
 constructor(private repository: StudentRepository) {}

 async login(studentId: string, password: string, rememberMe: boolean) {
 const authResult = await this.repository.authenticate(studentId, password);
 
 if (authResult.success && authResult.user) {
 const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
 const token = jwt.sign(
 { id: authResult.user.id, name: authResult.user.name }, 
 JWT_SECRET, 
 { expiresIn: rememberMe ? "30d" : "1h" }
 );
 return { success: true, user: authResult.user, token };
 }
 return { success: false, error: "Invalid credentials" };
 }

 async getDashboardData(studentId: string) {
 const [attendance, timetable] = await Promise.all([
 this.repository.getAttendance(studentId),
 this.repository.getTimetable(studentId)
 ]);
 
 return { attendance, timetable };
 }
}
