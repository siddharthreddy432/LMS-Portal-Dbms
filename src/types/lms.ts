export type LMSFileType = 'pdf' | 'doc' | 'ppt' | 'code' | 'zip' | 'link';

export interface LMSResource {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  unit: string;
  category: 'Lecture Notes' | 'Slides / PPT' | 'Lab Manual' | 'Previous Papers' | 'Reference Material' | 'Assignment Guide';
  fileType: LMSFileType;
  fileName: string;
  fileSize: string;
  fileUrl?: string; // Data URL or external link
  previewContent?: string; // Rich preview text/code/slides
  uploadedBy: string; // Lecturer name
  lecturerRole?: string;
  uploadedAt: string;
  downloadCount: number;
  pinned: boolean;
  tags: string[];
}

export interface LMSSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileName: string;
  fileData?: string;
  fileSize?: string;
  remarks?: string;
  grade?: number;
  maxMarks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface LMSAssignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  unit?: string;
  createdBy: string;
  createdAt: string;
  attachments?: {
    name: string;
    url?: string;
    size: string;
    type: LMSFileType;
  }[];
  submissionsCount: number;
  status: 'active' | 'closed';
  submissions: LMSSubmission[];
}

export interface LMSAnnouncement {
  id: string;
  courseId?: string;
  courseCode?: string;
  courseName?: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  priority: 'urgent' | 'important' | 'general';
  attachment?: {
    name: string;
    size: string;
    url?: string;
  };
}

export interface LMSDiscussionReply {
  id: string;
  author: string;
  authorRole: 'lecturer' | 'student';
  content: string;
  createdAt: string;
}

export interface LMSDiscussion {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'lecturer' | 'student';
  createdAt: string;
  tags: string[];
  replies: LMSDiscussionReply[];
  resolved: boolean;
}

export interface LMSCourse {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: string;
  academicYear: string;
  color: string;
  accentBg: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    cabin: string;
    avatar: string;
    title: string;
  };
  schedule: string;
  room: string;
  syllabusUnits: {
    unitNumber: number;
    title: string;
    topics: string[];
    completed: boolean;
  }[];
  progress: number;
}

export interface Lecturer {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  cabin: string;
  phone?: string;
  avatar: string;
  assignedCourseCodes: string[];
  officeHours: string;
  bio: string;
}
