export interface User {
 id: string;
 name: string;
 studentId: string;
 avatar?: string;
 token?: string;
 isMock?: boolean;
}

export interface AcademicYear {
 value: string;
 label: string;
}

export interface Semester {
 value: string;
 label: string;
}

export interface AuthContextType {
 user: User | null;
 loading: boolean;
 login: (id: string, pass: string) => Promise<boolean>;
 logout: () => void;
 error: string | null;
 clearError: () => void;
}
