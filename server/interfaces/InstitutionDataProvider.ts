export interface UserProfile {
 id: string;
 name: string;
 program?: string;
}

export interface SubjectAttendance {
 code: string;
 name: string;
 totalClasses: number;
 attendedClasses: number;
 percentage: number;
 type?: 'L' | 'T' | 'P' | 'S';
}

export interface TimetableClass {
 id: string;
 time: string;
 name: string;
 room: string;
 day: string;
}

export interface InstitutionDataProvider {
 authenticate(studentId: string, password: string): Promise<{ success: boolean; user?: UserProfile }>;
 getAttendance(studentId: string): Promise<SubjectAttendance[]>;
 getTimetable(studentId: string): Promise<TimetableClass[]>;
}
