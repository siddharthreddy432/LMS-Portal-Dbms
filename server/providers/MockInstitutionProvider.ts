import { InstitutionDataProvider, SubjectAttendance, TimetableClass, UserProfile } from '../interfaces/InstitutionDataProvider';

export class MockInstitutionProvider implements InstitutionDataProvider {
 async authenticate(studentId: string, password: string): Promise<{ success: boolean; user?: UserProfile }> {
 if (studentId && password) {
 return { 
 success: true, 
 user: { 
 id: studentId, 
 name: 'Siddharth Reddy',
 program: 'B.Tech Computer Science'
 } 
 };
 }
 return { success: false };
 }

 async getAttendance(studentId: string): Promise<SubjectAttendance[]> {
 return [
 { code: 'CS201', name: 'Data Structures', totalClasses: 40, attendedClasses: 34, percentage: 85, type: 'L' },
 { code: 'CS202', name: 'Web Development', totalClasses: 30, attendedClasses: 21, percentage: 70, type: 'L' },
 { code: 'CS203', name: 'Operating Systems', totalClasses: 35, attendedClasses: 31, percentage: 88.5, type: 'L' },
 { code: 'CS204', name: 'Machine Learning', totalClasses: 25, attendedClasses: 19, percentage: 76, type: 'L' },
 ];
 }

 async getTimetable(studentId: string): Promise<TimetableClass[]> {
 return [
 { id: '1', time: '09:00 AM', name: 'Data Structures', room: 'Room 304', day: 'Monday' },
 { id: '2', time: '11:30 AM', name: 'Web Development', room: 'Lab 2', day: 'Monday' },
 { id: '3', time: '02:00 PM', name: 'Machine Learning', room: 'Room 101', day: 'Monday' },
 ];
 }
}
