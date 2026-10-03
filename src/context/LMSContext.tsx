import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';
import {
  LMSCourse,
  LMSResource,
  LMSAssignment,
  LMSSubmission,
  LMSAnnouncement,
  LMSDiscussion,
  Lecturer
} from '../types/lms';
import {
  INITIAL_COURSES,
  INITIAL_LECTURERS,
  INITIAL_RESOURCES,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DISCUSSIONS
} from '../data/lmsData';

interface LMSContextType {
  courses: LMSCourse[];
  resources: LMSResource[];
  assignments: LMSAssignment[];
  announcements: LMSAnnouncement[];
  discussions: LMSDiscussion[];
  lecturers: Lecturer[];
  activeLecturer: Lecturer;
  userRole: 'student' | 'lecturer';
  setUserRole: (role: 'student' | 'lecturer') => void;
  setActiveLecturerId: (id: string) => void;
  addResource: (resource: Omit<LMSResource, 'id' | 'uploadedAt' | 'downloadCount'>) => LMSResource;
  deleteResource: (id: string) => void;
  togglePinResource: (id: string) => void;
  createAssignment: (assignment: Omit<LMSAssignment, 'id' | 'createdAt' | 'submissions' | 'submissionsCount'>) => LMSAssignment;
  submitAssignment: (assignmentId: string, submission: { fileName: string; fileData?: string; fileSize?: string; remarks?: string }) => void;
  gradeSubmission: (assignmentId: string, submissionId: string, grade: number, feedback: string) => void;
  createAnnouncement: (announcement: Omit<LMSAnnouncement, 'id' | 'date'>) => LMSAnnouncement;
  deleteAnnouncement: (id: string) => void;
  addDiscussion: (discussion: Omit<LMSDiscussion, 'id' | 'createdAt' | 'replies' | 'resolved'>) => LMSDiscussion;
  addDiscussionReply: (discussionId: string, content: string) => void;
  downloadResource: (resource: LMSResource) => void;
  resetToDefaultData: () => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RESOURCES: 'klu_lms_resources_v1',
  ASSIGNMENTS: 'klu_lms_assignments_v1',
  ANNOUNCEMENTS: 'klu_lms_announcements_v1',
  DISCUSSIONS: 'klu_lms_discussions_v1',
  ACTIVE_LECTURER: 'klu_lms_active_lecturer',
  USER_ROLE: 'klu_lms_user_role'
};

export function LMSProvider({ children }: { children: React.ReactNode }) {
  const [courses] = useState<LMSCourse[]>(INITIAL_COURSES);
  const [lecturers] = useState<Lecturer[]>(INITIAL_LECTURERS);
  
  const [activeLecturerId, setActiveLecturerIdState] = useState<string>(() => {
    return safeStorage.getItem(STORAGE_KEYS.ACTIVE_LECTURER) || INITIAL_LECTURERS[0].id;
  });

  const [userRole, setUserRoleState] = useState<'student' | 'lecturer'>(() => {
    return (safeStorage.getItem(STORAGE_KEYS.USER_ROLE) as 'student' | 'lecturer') || 'student';
  });

  const [resources, setResources] = useState<LMSResource[]>(() => {
    const cached = safeStorage.getCachedJson<LMSResource[]>(STORAGE_KEYS.RESOURCES);
    return cached && Array.isArray(cached) && cached.length > 0 ? cached : INITIAL_RESOURCES;
  });

  const [assignments, setAssignments] = useState<LMSAssignment[]>(() => {
    const cached = safeStorage.getCachedJson<LMSAssignment[]>(STORAGE_KEYS.ASSIGNMENTS);
    return cached && Array.isArray(cached) && cached.length > 0 ? cached : INITIAL_ASSIGNMENTS;
  });

  const [announcements, setAnnouncements] = useState<LMSAnnouncement[]>(() => {
    const cached = safeStorage.getCachedJson<LMSAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS);
    return cached && Array.isArray(cached) && cached.length > 0 ? cached : INITIAL_ANNOUNCEMENTS;
  });

  const [discussions, setDiscussions] = useState<LMSDiscussion[]>(() => {
    const cached = safeStorage.getCachedJson<LMSDiscussion[]>(STORAGE_KEYS.DISCUSSIONS);
    return cached && Array.isArray(cached) && cached.length > 0 ? cached : INITIAL_DISCUSSIONS;
  });

  // Save changes to safeStorage
  useEffect(() => {
    safeStorage.setCachedJson(STORAGE_KEYS.RESOURCES, resources);
  }, [resources]);

  useEffect(() => {
    safeStorage.setCachedJson(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }, [assignments]);

  useEffect(() => {
    safeStorage.setCachedJson(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  useEffect(() => {
    safeStorage.setCachedJson(STORAGE_KEYS.DISCUSSIONS, discussions);
  }, [discussions]);

  const setUserRole = (role: 'student' | 'lecturer') => {
    setUserRoleState(role);
    safeStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  };

  const setActiveLecturerId = (id: string) => {
    setActiveLecturerIdState(id);
    safeStorage.setItem(STORAGE_KEYS.ACTIVE_LECTURER, id);
  };

  const activeLecturer = lecturers.find(l => l.id === activeLecturerId) || lecturers[0];

  const addResource = (resourceData: Omit<LMSResource, 'id' | 'uploadedAt' | 'downloadCount'>): LMSResource => {
    const newResource: LMSResource = {
      ...resourceData,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadedAt: 'Just now',
      downloadCount: 0,
      pinned: resourceData.pinned || false,
    };
    setResources(prev => [newResource, ...prev]);
    return newResource;
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const togglePinResource = (id: string) => {
    setResources(prev =>
      prev.map(r => (r.id === id ? { ...r, pinned: !r.pinned } : r))
    );
  };

  const createAssignment = (assignmentData: Omit<LMSAssignment, 'id' | 'createdAt' | 'submissions' | 'submissionsCount'>): LMSAssignment => {
    const newAssignment: LMSAssignment = {
      ...assignmentData,
      id: `asg-${Date.now()}`,
      createdAt: 'Just now',
      submissionsCount: 0,
      submissions: []
    };
    setAssignments(prev => [newAssignment, ...prev]);
    return newAssignment;
  };

  const submitAssignment = (
    assignmentId: string,
    submissionData: { fileName: string; fileData?: string; fileSize?: string; remarks?: string }
  ) => {
    const newSubmission: LMSSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId: '2300030114',
      studentName: 'Siddharth Reddy',
      submittedAt: 'Just now',
      fileName: submissionData.fileName,
      fileData: submissionData.fileData,
      fileSize: submissionData.fileSize || '120 KB',
      remarks: submissionData.remarks || '',
      status: 'submitted'
    };

    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id === assignmentId) {
          // Replace if already submitted by this student, or append
          const existingFiltered = asg.submissions.filter(s => s.studentId !== '2300030114');
          return {
            ...asg,
            submissionsCount: existingFiltered.length + 1,
            submissions: [newSubmission, ...existingFiltered]
          };
        }
        return asg;
      })
    );
  };

  const gradeSubmission = (assignmentId: string, submissionId: string, grade: number, feedback: string) => {
    setAssignments(prev =>
      prev.map(asg => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            submissions: asg.submissions.map(sub => {
              if (sub.id === submissionId) {
                return {
                  ...sub,
                  grade,
                  feedback,
                  status: 'graded'
                };
              }
              return sub;
            })
          };
        }
        return asg;
      })
    );
  };

  const createAnnouncement = (announcementData: Omit<LMSAnnouncement, 'id' | 'date'>): LMSAnnouncement => {
    const newAnnouncement: LMSAnnouncement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      date: 'Just now'
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    return newAnnouncement;
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addDiscussion = (discussionData: Omit<LMSDiscussion, 'id' | 'createdAt' | 'replies' | 'resolved'>): LMSDiscussion => {
    const newDiscussion: LMSDiscussion = {
      ...discussionData,
      id: `disc-${Date.now()}`,
      createdAt: 'Just now',
      replies: [],
      resolved: false
    };
    setDiscussions(prev => [newDiscussion, ...prev]);
    return newDiscussion;
  };

  const addDiscussionReply = (discussionId: string, content: string) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      author: userRole === 'lecturer' ? activeLecturer.name : 'Siddharth Reddy',
      authorRole: userRole,
      content,
      createdAt: 'Just now'
    };

    setDiscussions(prev =>
      prev.map(disc => {
        if (disc.id === discussionId) {
          return {
            ...disc,
            replies: [...disc.replies, newReply]
          };
        }
        return disc;
      })
    );
  };

  const downloadResource = (resource: LMSResource) => {
    // Increment download count
    setResources(prev =>
      prev.map(r => (r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r))
    );

    // If fileData exists (Data URL uploaded by user)
    if (resource.fileUrl && resource.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = resource.fileUrl;
      a.download = resource.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Otherwise generate downloadable text/markdown file
    const content = resource.previewContent || `KL UNIVERSITY LEARNING MANAGEMENT SYSTEM (LMS)\n\nFile: ${resource.fileName}\nCourse: ${resource.courseCode} - ${resource.courseName}\nUploaded by: ${resource.uploadedBy}\nUnit: ${resource.unit}\nCategory: ${resource.category}\n\nDescription:\n${resource.description}\n\n[End of Document]`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resource.fileName.endsWith('.pdf') ? resource.fileName.replace('.pdf', '.txt') : resource.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefaultData = () => {
    setResources(INITIAL_RESOURCES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setDiscussions(INITIAL_DISCUSSIONS);
    safeStorage.removeItem(STORAGE_KEYS.RESOURCES);
    safeStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    safeStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    safeStorage.removeItem(STORAGE_KEYS.DISCUSSIONS);
  };

  const contextValue = React.useMemo(() => ({
    courses,
    resources,
    assignments,
    announcements,
    discussions,
    lecturers,
    activeLecturer,
    userRole,
    setUserRole,
    setActiveLecturerId,
    addResource,
    deleteResource,
    togglePinResource,
    createAssignment,
    submitAssignment,
    gradeSubmission,
    createAnnouncement,
    deleteAnnouncement,
    addDiscussion,
    addDiscussionReply,
    downloadResource,
    resetToDefaultData
  }), [
    courses,
    resources,
    assignments,
    announcements,
    discussions,
    lecturers,
    activeLecturer,
    userRole
  ]);

  return (
    <LMSContext.Provider value={contextValue}>
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
}
