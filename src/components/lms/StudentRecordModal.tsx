import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Award,
  FileText,
  Printer,
  ShieldCheck,
  Check
} from 'lucide-react';

export interface StudentRecordData {
  name: string;
  id: string;
  email?: string;
  course: string;
  att: number;
  sub: string;
  cgpa?: string;
  section?: string;
  advisor?: string;
  status?: string;
  ltps?: {
    L: string;
    T: string;
    P: string;
    S: string;
  };
  assignments?: Array<{
    title: string;
    score: string;
    status: 'Graded' | 'Submitted' | 'Late';
    date: string;
  }>;
  recentSessions?: Array<{
    date: string;
    type: string;
    topic: string;
    status: 'Present' | 'Absent' | 'On Duty';
  }>;
}

interface StudentRecordModalProps {
  student: StudentRecordData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentRecordModal({ student, isOpen, onClose }: StudentRecordModalProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'assignments' | 'ledger'>('attendance');
  const [noticeSent, setNoticeSent] = useState(false);

  if (!isOpen || !student) return null;

  const isAttendanceSafe = student.att >= 75;
  const isHighAttendance = student.att >= 85;

  const handleSendNotice = () => {
    setNoticeSent(true);
    setTimeout(() => setNoticeSent(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/20 rounded-3xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden my-6 flex flex-col max-h-[90vh]"
        >
          {/* Header Banner */}
          <div className="bg-brand-yellow border-b-3 border-black p-4 sm:p-6 text-black flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black text-white border-2 border-black flex items-center justify-center font-black text-lg sm:text-xl shadow-[2px_2px_0px_0px_#000] shrink-0">
                {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black px-2 py-0.5 bg-black text-white rounded">
                    {student.id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-white border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                    {student.section || 'Section S14'}
                  </span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${
                    isAttendanceSafe ? 'bg-brand-green text-black' : 'bg-brand-pink text-white'
                  }`}>
                    {student.status || (isAttendanceSafe ? 'Eligible for Exam' : 'Attendance Condonation Required')}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-black truncate">
                  {student.name}
                </h2>

                <p className="text-xs font-bold text-black/80 flex items-center gap-2 flex-wrap">
                  <span>Enrolled: <strong>{student.course}</strong></span>
                  {student.cgpa && (
                    <>
                      <span>•</span>
                      <span>CGPA: <strong>{student.cgpa}</strong></span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 bg-white hover:bg-brand-pink hover:text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-colors shrink-0 text-black"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub Navigation Bar */}
          <div className="px-5 py-2.5 bg-gray-50 dark:bg-white/5 border-b-2 border-black dark:border-white/10 flex items-center justify-between gap-3 text-xs overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3 py-1.5 rounded-lg font-black border-2 transition-all ${
                  activeTab === 'attendance'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black'
                }`}
              >
                Attendance & LTPS
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`px-3 py-1.5 rounded-lg font-black border-2 transition-all ${
                  activeTab === 'assignments'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black'
                }`}
              >
                Submissions ({student.sub})
              </button>
              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-3 py-1.5 rounded-lg font-black border-2 transition-all ${
                  activeTab === 'ledger'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black'
                }`}
              >
                Session Ledger
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-white dark:bg-[#15181D] border-2 border-black rounded-lg font-black flex items-center gap-1 text-[var(--text-primary)] shadow-[1px_1px_0px_0px_#000] hover:bg-brand-yellow shrink-0"
              title="Print Student Record"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {/* TAB 1: Attendance Breakdown */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                {/* Overall Attendance Stat Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                      Overall Course Attendance
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className={`text-4xl font-black font-display ${
                        isHighAttendance ? 'text-brand-green' : isAttendanceSafe ? 'text-amber-500' : 'text-brand-pink'
                      }`}>
                        {student.att}%
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {isAttendanceSafe ? 'Above minimum 75% threshold' : 'Below university 75% cutoff'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#1B1F26] rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-green">
                      <ShieldCheck size={14} />
                      <span>{isHighAttendance ? 'Safe Standing: Can miss up to 2 classes' : isAttendanceSafe ? 'Warning: Attend all next lectures' : 'Condonation Fee Applicable'}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Minimum required for End-Semester Hall Ticket: 75.0%
                    </p>
                  </div>
                </div>

                {/* LTPS Breakdown Grid */}
                <div>
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-2.5">
                    LTPS Component Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-white dark:bg-[#15181D] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-black text-brand-purple block uppercase">Lecture (L)</span>
                      <span className="text-lg font-black text-[var(--text-primary)] mt-1 block">
                        {student.ltps?.L || '24/26'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">Weightage: 1.0</span>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-[#15181D] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-black text-brand-blue block uppercase">Tutorial (T)</span>
                      <span className="text-lg font-black text-[var(--text-primary)] mt-1 block">
                        {student.ltps?.T || '8/10'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">Weightage: 1.0</span>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-[#15181D] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-black text-brand-green block uppercase">Practical (P)</span>
                      <span className="text-lg font-black text-[var(--text-primary)] mt-1 block">
                        {student.ltps?.P || '12/14'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">Weightage: 2.0</span>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-[#15181D] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-black text-brand-orange block uppercase">Skilling (S)</span>
                      <span className="text-lg font-black text-[var(--text-primary)] mt-1 block">
                        {student.ltps?.S || '8/8'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">Weightage: 1.0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Submissions & Coursework */}
            {activeTab === 'assignments' && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                  Coursework Submissions & Assessments
                </h4>

                {(student.assignments || [
                  { title: 'Assignment 1: AVL & Self-Balancing Binary Trees', score: '19/20', status: 'Graded', date: '12 Feb' },
                  { title: 'Assignment 2: Red-Black Trees & Binary Heaps', score: '18/20', status: 'Graded', date: '28 Feb' },
                  { title: 'Assignment 3: Graph Traversal & Dijkstra MST', score: 'Pending Review', status: 'Submitted', date: '18 Mar' },
                ]).map((asg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-gray-50 dark:bg-[#15181D] border-2 border-black/10 dark:border-white/10 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-extrabold text-sm text-[var(--text-primary)] truncate">
                        {asg.title}
                      </p>
                      <p className="text-xs text-gray-500 font-bold">
                        Submitted: {asg.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 bg-white dark:bg-[#1B1F26] border border-black/20 dark:border-white/20 rounded-lg text-xs font-black text-[var(--text-primary)]">
                        {asg.score}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                        asg.status === 'Graded' ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-blue/20 text-brand-blue'
                      }`}>
                        {asg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Recent Session Ledger */}
            {activeTab === 'ledger' && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                  Recent 5 Class Sessions
                </h4>

                <div className="space-y-2">
                  {(student.recentSessions || [
                    { date: '28 Sep', type: 'Lecture', topic: 'Graph Shortest Paths & Dijkstra', status: 'Present' },
                    { date: '26 Sep', type: 'Lab', topic: 'C++ Implementation of Adjacency List', status: 'Present' },
                    { date: '24 Sep', type: 'Tutorial', topic: 'Dynamic Programming Practice Set', status: 'Present' },
                    { date: '22 Sep', type: 'Lecture', topic: 'Bellman-Ford Algorithm Invariants', status: 'Absent' },
                    { date: '19 Sep', type: 'Lecture', topic: 'Floyd-Warshall All Pairs Shortest', status: 'Present' },
                  ]).map((sess, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-[#15181D] border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-gray-500 w-14 shrink-0">
                          {sess.date}
                        </span>
                        <span className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-black text-[10px] uppercase">
                          {sess.type}
                        </span>
                        <span className="font-bold text-[var(--text-primary)] truncate max-w-[240px]">
                          {sess.topic}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded font-black text-[11px] shrink-0 ${
                        sess.status === 'Present'
                          ? 'bg-brand-green/20 text-brand-green'
                          : sess.status === 'On Duty'
                          ? 'bg-brand-blue/20 text-brand-blue'
                          : 'bg-brand-pink/20 text-brand-pink'
                      }`}>
                        {sess.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-gray-100 dark:bg-[#15181D] border-t-3 border-black dark:border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-gray-500 text-center sm:text-left">
              Official KL University ERP Cohort Record • Student ID: {student.id}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSendNotice}
                className="flex-1 sm:flex-none px-4 py-2 bg-brand-yellow text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                {noticeSent ? (
                  <>
                    <Check size={14} />
                    <span>Academic Notice Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    <span>Send Notice / Reminder</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white dark:bg-[#1B1F26] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
