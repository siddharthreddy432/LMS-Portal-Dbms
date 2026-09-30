import { InstitutionDataProvider } from '../interfaces/InstitutionDataProvider';

export class StudentRepository {
 constructor(private provider: InstitutionDataProvider) {}

 async authenticate(studentId: string, password: string) {
 return this.provider.authenticate(studentId, password);
 }

 async getAttendance(studentId: string) {
 return this.provider.getAttendance(studentId);
 }

 async getTimetable(studentId: string) {
 return this.provider.getTimetable(studentId);
 }
}
