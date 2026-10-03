import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Award,
  Megaphone,
  CheckCircle2,
  Circle,
  Download,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  Search,
  CheckSquare,
  GraduationCap,
  TrendingUp,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { safeStorage } from '../utils/storage';
import { LMSAssignment, LMSResource, LMSFileType } from '../types/lms';
import AssignmentSubmitModal from '../components/lms/AssignmentSubmitModal';
import FilePreviewModal from '../components/lms/FilePreviewModal';
import { Link, useNavigate } from 'react-router-dom';

interface TimetableSlot {
  id: string;
  time: string;
  courseCode: string;
  courseName: string;
  type: 'Lecture' | 'Practical' | 'Skilling';
  room: string;
  lecturer: string;
}

const TIMETABLE: Record<string, TimetableSlot[]> = {
  Mon: [
    { id: 'm1', time: '09:00 - 10:40 AM', courseCode: '25SC1204E', courseName: 'Data Structures and Algorithms - 1', type: 'Lecture', room: 'LH-201', lecturer: 'Dr. Rajesh Sharma' },
    { id: 'm2', time: '11:00 - 12:40 PM', courseCode: '25CS1201E', courseName: 'Front End Development Frameworks', type: 'Lecture', room: 'LH-204', lecturer: 'Prof. Ananya Roy' },
    { id: 'm3', time: '01:30 - 03:10 PM', courseCode: '25SC1204E', courseName: 'DSA Practical Lab', type: 'Practical', room: 'CS Lab 4', lecturer: 'Dr. Rajesh Sharma' },
    { id: 'm4', time: '03:20 - 05:00 PM', courseCode: '25EC2101E', courseName: 'Digital Design & Architecture', type: 'Lecture', room: 'Block C-102', lecturer: 'Dr. Sunita Patil' }
  ],
  Tue: [
    { id: 't1', time: '09:00 - 10:40 AM', courseCode: '25SC1306E', courseName: 'Computational Foundations for AI', type: 'Lecture', room: 'T-Hub 208', lecturer: 'Dr. K. Venkatesh' },
    { id: 't2', time: '11:00 - 12:40 PM', courseCode: '25CS1302E', courseName: 'Database Systems Engineering', type: 'Lecture', room: 'LH-302', lecturer: 'Dr. Rajesh Sharma' },
    { id: 't3', time: '01:30 - 04:00 PM', courseCode: '25CS1201E', courseName: 'Web Frameworks Hands-on Lab', type: 'Practical', room: 'Software Lab 2', lecturer: 'Prof. Ananya Roy' }
  ],
  Wed: [
    { id: 'w1', time: '09:00 - 10:40 AM', courseCode: '25MT1205E', courseName: 'Mathematics For AI', type: 'Lecture', room: 'LH-101', lecturer: 'Dr. K. Venkatesh' },
    { id: 'w2', time: '11:00 - 12:40 PM', courseCode: '25SC1204E', courseName: 'Data Structures and Algorithms - 1', type: 'Lecture', room: 'LH-201', lecturer: 'Dr. Rajesh Sharma' },
    { id: 'w3', time: '01:30 - 03:10 PM', courseCode: '25EC2101E', courseName: 'Digital Design FPGA Lab', type: 'Practical', room: 'VLSI Lab 1', lecturer: 'Dr. Sunita Patil' },
    { id: 'w4', time: '03:20 - 05:00 PM', courseCode: '25UC1204E', courseName: 'Communication & Soft Skills', type: 'Skilling', room: 'Audio-Visual Hall', lecturer: 'Faculty Lead' }
  ],
  Thu: [
    { id: 'th1', time: '09:00 - 10:40 AM', courseCode: '25CS1302E', courseName: 'Database Systems Lab', type: 'Practical', room: 'Database Lab 3', lecturer: 'Dr. Rajesh Sharma' },
    { id: 'th2', time: '11:00 - 12:40 PM', courseCode: '25SC1306E', courseName: 'Computational Foundations for AI', type: 'Lecture', room: 'T-Hub 208', lecturer: 'Dr. K. Venkatesh' },
    { id: 'th3', time: '02:00 - 04:00 PM', courseCode: '25CS1201E', courseName: 'Front End UI Engineering Skilling', type: 'Skilling', room: 'LH-204', lecturer: 'Prof. Ananya Roy' }
  ],
  Fri: [
    { id: 'f1', time: '09:00 - 10:40 AM', courseCode: '25SC1204E', courseName: 'Competitive Coding & DSA Skilling', type: 'Skilling', room: 'LH-201', lecturer: 'Dr. Rajesh Sharma' },
    { id: 'f2', time: '11:00 - 12:40 PM', courseCode: '25MT1205E', courseName: 'Linear Algebra & Optimization', type: 'Lecture', room: 'LH-101', lecturer: 'Dr. K. Venkatesh' },
    { id: 'f3', time: '01:30 - 03:30 PM', courseCode: '25SC1306E', courseName: 'Machine Learning Model Lab', type: 'Practical', room: 'AI GPU Lab', lecturer: 'Dr. K. Venkatesh' }
  ],
  Sat: [
    { id: 's1', time: '09:30 - 11:30 AM', courseCode: 'COLLAB', courseName: 'Capstone Project Mentoring & Review', type: 'Skilling', room: 'Innovation Center', lecturer: 'Faculty Panel' },
    { id: 's2', time: '12:00 - 01:30 PM', courseCode: 'SEMINAR', courseName: 'Industry Tech Talk & Seminar', type: 'Lecture', room: 'Main Auditorium', lecturer: 'Guest Speaker' }
  ]
};

interface StudyGoal {
  id: string;
  title: string;
  completed: boolean;
  tag: string;
}

const DEFAULT_GOALS: StudyGoal[] = [
  { id: 'g1', title: 'Complete AVL Tree Balancing problem set (DSA Unit 3)', completed: true, tag: 'DSA' },
  { id: 'g2', title: 'Implement React Query & Custom Hooks for UI assignment', completed: false, tag: 'Frontend' },
  { id: 'g3', title: 'Review Transformer Self-Attention matrix slides', completed: false, tag: 'AI' },
  { id: 'g4', title: 'Read Chapter 4: Relational Normalization BCNF', completed: false, tag: 'DBMS' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    courses,
    resources,
    assignments,
    announcements,
    downloadResource
  } = useLMS();

  // Active day for timetable
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const initialDay = (todayIndex >= 1 && todayIndex <= 6) ? days[todayIndex - 1] : 'Mon';
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);

  // Filter tabs for assignments
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'due' | 'submitted' | 'graded'>('all');

  // Search query for dashboard content
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeSubmitAssignment, setActiveSubmitAssignment] = useState<LMSAssignment | null>(null);
  const [activePreviewResource, setActivePreviewResource] = useState<LMSResource | null>(null);

  // Study goals state
  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const cached = safeStorage.getCachedJson<StudyGoal[]>('klu_student_study_goals');
    return cached && Array.isArray(cached) && cached.length > 0 ? cached : DEFAULT_GOALS;
  });
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    safeStorage.setCachedJson('klu_student_study_goals', goals);
  }, [goals]);

  const toggleGoal = useCallback((id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  }, []);

  const addGoal = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newG: StudyGoal = {
      id: 'g_' + Date.now(),
      title: newGoalText.trim(),
      completed: false,
      tag: 'Study'
    };
    setGoals(prev => [newG, ...prev]);
    setNewGoalText('');
  }, [newGoalText]);

  const removeGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // Student details
  const studentName = user?.name || 'Siddharth Reddy';
  const studentId = user?.id || '2300030114';

  // Assignment calculations - memoized
  const { mySubmissionsCount, pendingAssignments } = useMemo(() => {
    let subCount = 0;
    const pending: LMSAssignment[] = [];
    for (const a of assignments) {
      if (a.submissions.some(s => s.studentId === studentId)) {
        subCount++;
      } else {
        pending.push(a);
      }
    }
    return { mySubmissionsCount: subCount, pendingAssignments: pending };
  }, [assignments, studentId]);

  const filteredAssignments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return assignments.filter(asg => {
      const hasSubmitted = asg.submissions.some(s => s.studentId === studentId);
      const sub = asg.submissions.find(s => s.studentId === studentId);
      const isGraded = sub?.status === 'graded';

      if (assignmentFilter === 'due' && hasSubmitted) return false;
      if (assignmentFilter === 'submitted' && !hasSubmitted) return false;
      if (assignmentFilter === 'graded' && !isGraded) return false;

      if (!query) return true;
      return (
        asg.title.toLowerCase().includes(query) ||
        asg.courseCode.toLowerCase().includes(query) ||
        asg.courseName.toLowerCase().includes(query)
      );
    });
  }, [assignments, assignmentFilter, searchQuery, studentId]);

  // Recent study resources filtered - memoized
  const recentResources = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return resources.slice(0, 6);
    return resources.filter(res => (
      res.title.toLowerCase().includes(query) ||
      res.courseCode.toLowerCase().includes(query) ||
      res.unit.toLowerCase().includes(query)
    )).slice(0, 6);
  }, [resources, searchQuery]);

  // Overall syllabus progress - memoized
  const { totalUnits, completedUnits, syllabusPercentage } = useMemo(() => {
    const total = courses.reduce((acc, c) => acc + (c.syllabusUnits?.length || 5), 0);
    const completed = courses.reduce((acc, c) => acc + (c.syllabusUnits?.filter(u => u.completed).length || 3), 0);
    const pct = total > 0 ? Math.round((completed / total) * 100) : 68;
    return { totalUnits: total, completedUnits: completed, syllabusPercentage: pct };
  }, [courses]);

  // Timetable slots for current day - memoized
  const todaySlots = useMemo(() => TIMETABLE[selectedDay] || [], [selectedDay]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
      {/* 1. Header Hero - Academic Student Command Hub */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-yellow border-3 border-black rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/35 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 bg-black text-white text-[11px] font-black uppercase tracking-wider rounded-md">
                🎓 Academic Command Hub
              </span>
              <span className="px-2 py-0.5 bg-white text-black text-[11px] font-black rounded-md border border-black">
                Semester II • 2024-2025
              </span>
              <span className="px-2 py-0.5 bg-brand-green text-white text-[11px] font-black rounded-md border border-black">
                CGPA 9.18
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-black tracking-tight leading-tight">
              Welcome back, {studentName.split(' ')[0]}!
            </h1>
            <p className="text-black/80 font-bold text-xs sm:text-sm mt-1 max-w-2xl">
              Student ID: <span className="underline decoration-black">{studentId}</span> • B.Tech Computer Science & Engineering • 24 Registered Credits
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/courses"
              className="px-3.5 py-2 bg-brand-pink text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <BookOpen size={15} />
              <span>My Courses ({courses.length})</span>
            </Link>

            <Link
              to="/lecturers"
              className="px-3.5 py-2 bg-brand-purple text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <GraduationCap size={15} />
              <span>Lecturer Hub</span>
            </Link>

            <Link
              to="/ai-tutor"
              className="px-3.5 py-2 bg-white text-black border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-brand-pink" />
              <span>AI Doubt Tutor</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Academic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Active Courses</span>
            <BookOpen size={16} className="text-brand-blue" />
          </div>
          <p className="text-2xl font-black font-display text-[var(--text-primary)]">{courses.length}</p>
          <p className="text-[11px] font-bold text-gray-500 mt-0.5">24 Registered Credits</p>
        </div>

        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Pending Tasks</span>
            <Award size={16} className="text-brand-pink" />
          </div>
          <p className="text-2xl font-black font-display text-[var(--text-primary)]">{pendingAssignments.length}</p>
          <p className="text-[11px] font-bold text-gray-500 mt-0.5">{mySubmissionsCount} submitted & graded</p>
        </div>

        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Syllabus Covered</span>
            <TrendingUp size={16} className="text-brand-green" />
          </div>
          <p className="text-2xl font-black font-display text-[var(--text-primary)]">{syllabusPercentage}%</p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${syllabusPercentage}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Course Materials</span>
            <FileText size={16} className="text-brand-purple" />
          </div>
          <p className="text-2xl font-black font-display text-[var(--text-primary)]">{resources.length}</p>
          <p className="text-[11px] font-bold text-gray-500 mt-0.5">Slides, Handouts & Code</p>
        </div>
      </div>

      {/* 3. Main Content Grid: Left Column (Timetable + Deadlines + Materials) & Right Column (Announcements + Study Goals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Timetable & Class Schedule */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue text-white border-2 border-black flex items-center justify-center font-black">
                  <Calendar size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-black font-display text-[var(--text-primary)]">Class Timetable & Routine</h2>
                  <p className="text-xs font-bold text-gray-500">Live lecture schedule & venue rooms</p>
                </div>
              </div>

              {/* Day Selector Pills */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#15181D] p-1 rounded-xl border border-black/10">
                {days.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                      selectedDay === d
                        ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Slots List */}
            <div className="space-y-2.5">
              {todaySlots.map((slot, index) => {
                const isFirst = index === 0;
                return (
                  <div
                    key={slot.id}
                    className="p-3 bg-gray-50 dark:bg-[#171A20] border-2 border-black dark:border-white/15 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-center shrink-0 w-24">
                        <span className="text-[11px] font-black uppercase text-brand-pink block">{slot.time}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black inline-block mt-0.5 ${
                          slot.type === 'Practical'
                            ? 'bg-brand-green/20 text-brand-green'
                            : slot.type === 'Skilling'
                            ? 'bg-brand-purple/20 text-brand-purple'
                            : 'bg-brand-blue/20 text-brand-blue'
                        }`}>
                          {slot.type}
                        </span>
                      </div>

                      <div className="border-l-2 border-black/15 pl-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-500">{slot.courseCode}</span>
                          <span className="text-xs font-black text-[var(--text-primary)]">{slot.courseName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1 font-bold">
                            <MapPin size={12} className="text-brand-pink" />
                            {slot.room}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <User size={12} />
                            {slot.lecturer}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        to="/courses"
                        className="px-2.5 py-1 bg-white dark:bg-[#1B1F26] border border-black dark:border-white/20 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        <BookOpen size={12} />
                        <span>Course</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Registered Courses Overview */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-pink text-white border-2 border-black flex items-center justify-center font-black">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-black font-display text-[var(--text-primary)]">Enrolled Courses & Progress</h2>
                  <p className="text-xs font-bold text-gray-500">Real-time syllabus completion per subject</p>
                </div>
              </div>

              <Link
                to="/courses"
                className="text-xs font-black text-brand-pink hover:underline flex items-center gap-1"
              >
                <span>View All Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="p-3.5 bg-gray-50 dark:bg-[#171A20] border-2 border-black dark:border-white/15 rounded-xl hover:border-black transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-black px-2 py-0.5 bg-black text-white rounded">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500">{course.credits} Credits</span>
                    </div>

                    <h3 className="font-black text-sm text-[var(--text-primary)] line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                      <span>{course.instructor.name}</span>
                      <span>•</span>
                      <span>{course.instructor.cabin}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-gray-600 dark:text-gray-400">Syllabus Progress</span>
                      <span className="font-black text-brand-pink">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand-pink h-1.5 rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments & Action Items */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-purple text-white border-2 border-black flex items-center justify-center font-black">
                  <Award size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-black font-display text-[var(--text-primary)]">Assignments & Deadlines</h2>
                  <p className="text-xs font-bold text-gray-500">Track tasks and submit work directly</p>
                </div>
              </div>

              {/* Assignment Filter Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#15181D] p-1 rounded-xl border border-black/10">
                {(['all', 'due', 'submitted', 'graded'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAssignmentFilter(tab)}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg capitalize transition-all ${
                      assignmentFilter === tab
                        ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {tab === 'due' ? 'Due Soon' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-3">
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 size={32} className="mx-auto mb-2 text-brand-green" />
                  <p className="font-bold text-sm">No assignments found for this filter!</p>
                </div>
              ) : (
                filteredAssignments.map(asg => {
                  const submission = asg.submissions.find(s => s.studentId === studentId);
                  const isSubmitted = !!submission;
                  const isGraded = submission?.status === 'graded';

                  return (
                    <div
                      key={asg.id}
                      className="p-3.5 bg-gray-50 dark:bg-[#171A20] border-2 border-black dark:border-white/15 rounded-xl hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black px-2 py-0.5 bg-brand-purple/20 text-brand-purple rounded">
                            {asg.courseCode}
                          </span>
                          <span className="text-xs font-bold text-gray-500">Max Marks: {asg.maxMarks}</span>
                          {isSubmitted ? (
                            <span className="px-2 py-0.5 bg-brand-green/20 text-brand-green border border-brand-green/30 rounded text-[11px] font-black flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              {isGraded ? `Graded: ${submission.grade}/${asg.maxMarks}` : 'Submitted'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-brand-pink/20 text-brand-pink border border-brand-pink/30 rounded text-[11px] font-black flex items-center gap-1">
                              <Clock size={12} />
                              Due: {asg.dueDate}
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-sm text-[var(--text-primary)]">
                          {asg.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                          {asg.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isSubmitted ? (
                          <button
                            onClick={() => setActiveSubmitAssignment(asg)}
                            className="px-3 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 transition-all flex items-center gap-1"
                          >
                            <Eye size={13} />
                            <span>View Submission</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveSubmitAssignment(asg)}
                            className="px-3 py-1.5 bg-brand-purple text-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                          >
                            <UploadCloud size={13} />
                            <span>Submit Solution</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Study Materials & Handouts */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-green text-white border-2 border-black flex items-center justify-center font-black">
                  <FileText size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-black font-display text-[var(--text-primary)]">Recent Faculty Handouts & Notes</h2>
                  <p className="text-xs font-bold text-gray-500">Download and preview lecture slides directly</p>
                </div>
              </div>

              <Link
                to="/courses"
                className="text-xs font-black text-brand-green hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentResources.map(res => (
                <div
                  key={res.id}
                  className="p-3 bg-gray-50 dark:bg-[#171A20] border-2 border-black dark:border-white/15 rounded-xl flex items-center justify-between gap-3 hover:border-black transition-all"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-black px-1.5 py-0.2 bg-black text-white rounded">
                        {res.courseCode}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{res.fileType} • {res.fileSize}</span>
                    </div>
                    <p className="font-black text-xs text-[var(--text-primary)] truncate" title={res.title}>
                      {res.title}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {res.uploadedBy} • {res.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => navigate(`/preview/${res.id}`)}
                      className="p-1.5 bg-white dark:bg-[#1B1F26] border border-black dark:border-white/20 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      title="Preview Material in Full Page"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => downloadResource(res)}
                      className="p-1.5 bg-brand-green text-white border border-black rounded-lg hover:brightness-110 transition-all shadow-[1px_1px_0px_0px_#000]"
                      title="Download File"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col wide on desktop: Announcements + Study Goals + AI Tutor Prompt) */}
        <div className="space-y-6">

          {/* AI Doubt Tutor Quick Launcher */}
          <div className="bg-brand-pink border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-brand-yellow" />
              <h3 className="font-black font-display text-base">Instant AI Doubt Solver</h3>
            </div>
            <p className="text-xs font-bold text-white/90 leading-relaxed mb-3">
              Stuck on a tricky algorithm, database query, or UI concept? Get immediate step-by-step guidance tailored to your university curriculum.
            </p>
            <Link
              to="/ai-tutor"
              className="w-full py-2 bg-black text-white border-2 border-white/40 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <span>Ask a Question Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Personal Daily Study Goals & Checklist */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-brand-pink" />
                <h3 className="font-black font-display text-base text-[var(--text-primary)]">Daily Study Planner</h3>
              </div>
              <span className="text-[11px] font-black px-2 py-0.5 bg-brand-pink/20 text-brand-pink rounded-md">
                {goals.filter(g => g.completed).length} / {goals.length} Done
              </span>
            </div>

            {/* Add Goal Input */}
            <form onSubmit={addGoal} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add daily study target..."
                className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-black dark:border-white/20 bg-gray-50 dark:bg-[#15181D] text-[var(--text-primary)] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-black text-white border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-800 transition-all flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </form>

            {/* Goals List */}
            <div className="space-y-2">
              {goals.map(goal => (
                <div
                  key={goal.id}
                  className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#15181D] transition-colors group"
                >
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className="flex items-start gap-2.5 text-left flex-1"
                  >
                    <div className="mt-0.5">
                      {goal.completed ? (
                        <CheckCircle2 size={16} className="text-brand-green" />
                      ) : (
                        <Circle size={16} className="text-gray-400 group-hover:text-brand-pink" />
                      )}
                    </div>
                    <span className={`text-xs font-bold leading-snug ${
                      goal.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-[var(--text-primary)]'
                    }`}>
                      {goal.title}
                    </span>
                  </button>

                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="text-gray-400 hover:text-brand-red opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Department Announcements Feed */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-brand-orange" />
                <h3 className="font-black font-display text-base text-[var(--text-primary)]">Campus & Dept Notices</h3>
              </div>
              <span className="text-[11px] font-bold text-gray-500">{announcements.length} Live</span>
            </div>

            <div className="space-y-3">
              {announcements.map(ann => {
                const isUrgent = ann.priority === 'urgent';
                const isImportant = ann.priority === 'important';

                return (
                  <div
                    key={ann.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isUrgent
                        ? 'bg-brand-red/10 border-brand-red/40'
                        : isImportant
                        ? 'bg-brand-yellow/20 border-black/20'
                        : 'bg-gray-50 dark:bg-[#171A20] border-black/15 dark:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                        isUrgent
                          ? 'bg-brand-red text-white'
                          : isImportant
                          ? 'bg-brand-orange text-white'
                          : 'bg-brand-blue text-white'
                      }`}>
                        {ann.priority}
                      </span>
                      <span className="text-[11px] font-bold text-gray-500">{ann.date}</span>
                    </div>

                    <h4 className="font-black text-xs text-[var(--text-primary)] mt-1">
                      {ann.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {ann.content}
                    </p>
                    <div className="mt-2 text-[11px] font-bold text-gray-500 flex items-center justify-between">
                      <span>By: {ann.author}</span>
                      {ann.courseCode && <span className="font-mono">{ann.courseCode}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Modals for Assignment Submission and Resource Preview */}
      <AssignmentSubmitModal
        assignment={activeSubmitAssignment}
        isOpen={!!activeSubmitAssignment}
        onClose={() => setActiveSubmitAssignment(null)}
      />

      <FilePreviewModal
        resource={activePreviewResource}
        isOpen={!!activePreviewResource}
        onClose={() => setActivePreviewResource(null)}
      />
    </div>
  );
}
