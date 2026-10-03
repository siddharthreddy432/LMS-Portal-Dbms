import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
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
  Check,
  Phone,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  Send,
  Download
} from 'lucide-react';
import { STUDENT_COHORT_RECORDS, StudentRecord } from '../data/studentRecords';

export default function StudentRecordPage() {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const studentId = id || queryId;

  const navigate = useNavigate();
  const [noticeSent, setNoticeSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'assignments' | 'ledger'>('attendance');

  const student: StudentRecord | undefined = useMemo(() => {
    if (!studentId) return STUDENT_COHORT_RECORDS[0];
    return STUDENT_COHORT_RECORDS.find(s => s.id === studentId) || STUDENT_COHORT_RECORDS[0];
  }, [studentId]);

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
          Student Record Not Found
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          The requested student roll number does not exist in the active cohort ledger.
        </p>
        <Link
          to="/lecturers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000]"
        >
          <ArrowLeft size={14} />
          <span>Return to Faculty Portal</span>
        </Link>
      </div>
    );
  }

  const isAttendanceSafe = student.att >= 75;
  const isHighAttendance = student.att >= 85;

  const handleSendNotice = () => {
    setNoticeSent(true);
    setTimeout(() => setNoticeSent(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/lecturers')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            <span>Faculty Portal</span>
          </button>

          <span className="text-gray-400">•</span>

          <span className="text-xs font-bold text-gray-500">Student Cohort Ledger</span>

          <span className="text-gray-400">/</span>

          <span className="text-xs font-black px-2 py-0.5 bg-black text-white rounded font-mono">
            {student.id}
          </span>

          <span className="text-gray-400">/</span>

          <span className="text-xs font-bold text-[var(--text-primary)]">
            {student.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 text-[var(--text-primary)]"
            title="Print Full Dossier"
          >
            <Printer size={14} />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleSendNotice}
            className="px-4 py-1.5 bg-brand-yellow text-black border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            {noticeSent ? (
              <>
                <Check size={14} />
                <span>Notice Sent to {student.email}!</span>
              </>
            ) : (
              <>
                <Mail size={14} />
                <span>Dispatch Academic Notice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-brand-yellow border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] text-black relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black text-white border-3 border-black flex items-center justify-center font-black text-2xl sm:text-3xl shadow-[3px_3px_0px_0px_#000] shrink-0">
              {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-black px-2.5 py-0.5 bg-black text-white rounded">
                  {student.id}
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 bg-white border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                  {student.section}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-white/70 border border-black/30 rounded">
                  {student.batch || 'B.Tech CSE 2023-2027'}
                </span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${
                  isAttendanceSafe ? 'bg-brand-green text-black' : 'bg-brand-pink text-white'
                }`}>
                  {student.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-black">
                {student.name}
              </h1>

              <p className="text-xs sm:text-sm font-bold text-black/85 flex items-center gap-2 flex-wrap">
                <span>Course: <strong>{student.course}</strong></span>
                <span>•</span>
                <span>Faculty Mentor: <strong>{student.advisor}</strong></span>
                <span>•</span>
                <span>Email: <a href={`mailto:${student.email}`} className="underline">{student.email}</a></span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 self-stretch lg:self-auto min-w-[280px]">
            <div className="p-3.5 bg-white border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[11px] font-black uppercase text-gray-500 block">Attendance</span>
              <span className={`text-2xl font-black font-display mt-0.5 block ${
                isHighAttendance ? 'text-brand-green' : isAttendanceSafe ? 'text-amber-600' : 'text-brand-pink'
              }`}>
                {student.att}%
              </span>
            </div>

            <div className="p-3.5 bg-white border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[11px] font-black uppercase text-gray-500 block">CGPA</span>
              <span className="text-2xl font-black font-display text-brand-purple mt-0.5 block">
                {student.cgpa}
              </span>
            </div>

            <div className="p-3.5 bg-white border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[11px] font-black uppercase text-gray-500 block">Tasks</span>
              <span className="text-2xl font-black font-display text-brand-blue mt-0.5 block">
                {student.sub}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Analytics (7 cols) + Right Column Ledger & Info (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Attendance & LTPS Analytics Card */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-green text-black border-2 border-black flex items-center justify-center font-black">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-black font-display text-lg text-[var(--text-primary)]">
                    Attendance Standing & LTPS Breakdown
                  </h3>
                  <p className="text-xs font-bold text-gray-500">Official weighted attendance calculation</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                isAttendanceSafe
                  ? 'bg-brand-green/20 text-green-700 dark:text-green-300 border-green-500/30'
                  : 'bg-brand-pink/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
              }`}>
                {isAttendanceSafe ? 'Eligible for Hall Ticket' : 'Shortage - Action Needed'}
              </span>
            </div>

            {/* Threshold Banner */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#15181D] border-2 border-black/15 dark:border-white/10 flex items-start gap-3">
              <div className="mt-0.5">
                {isAttendanceSafe ? (
                  <CheckCircle2 size={18} className="text-brand-green" />
                ) : (
                  <AlertTriangle size={18} className="text-brand-pink" />
                )}
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-black text-[var(--text-primary)]">
                  {isHighAttendance
                    ? 'Excellent Compliance: Student has attended over 85% of total sessions.'
                    : isAttendanceSafe
                    ? 'Cautionary Safe Zone: Student is currently above 75% cutoff threshold.'
                    : 'Condonation Alert: Student attendance is below university mandatory 75% requirement.'}
                </p>
                <p className="text-gray-500 font-medium">
                  {isHighAttendance
                    ? 'Student can safely miss up to 2 class sessions without falling below 85%.'
                    : isAttendanceSafe
                    ? 'Must attend all remaining 4 lectures to maintain exam clearance.'
                    : 'Requires formal medical or faculty duty condonation approval before exam week.'}
                </p>
              </div>
            </div>

            {/* 4 LTPS Component Cards */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-3">
                Component Performance Weights
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-gray-50 dark:bg-[#15181D] border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-xs font-black text-brand-purple block uppercase">Lecture (L)</span>
                  <span className="text-xl font-black text-[var(--text-primary)] mt-1 block">
                    {student.ltps.L}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Weight: 1.0</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#15181D] border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-xs font-black text-brand-blue block uppercase">Tutorial (T)</span>
                  <span className="text-xl font-black text-[var(--text-primary)] mt-1 block">
                    {student.ltps.T}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Weight: 1.0</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#15181D] border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-xs font-black text-brand-green block uppercase">Practical (P)</span>
                  <span className="text-xl font-black text-[var(--text-primary)] mt-1 block">
                    {student.ltps.P}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Weight: 2.0</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#15181D] border-2 border-black rounded-2xl text-center shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-xs font-black text-brand-orange block uppercase">Skilling (S)</span>
                  <span className="text-xl font-black text-[var(--text-primary)] mt-1 block">
                    {student.ltps.S}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Weight: 1.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coursework & Assignment Evaluations */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-purple text-white border-2 border-black flex items-center justify-center font-black">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-black font-display text-lg text-[var(--text-primary)]">
                    Continuous Assessments & Submissions
                  </h3>
                  <p className="text-xs font-bold text-gray-500">Graded assignments and lab blueprints</p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-black text-white text-xs font-black rounded-lg">
                {student.sub} Submitted
              </span>
            </div>

            <div className="space-y-3">
              {student.assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-4 bg-gray-50 dark:bg-[#15181D] border-2 border-black/15 dark:border-white/10 rounded-2xl space-y-2 hover:border-black transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-black text-sm text-[var(--text-primary)] truncate">
                        {asg.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-bold">
                        Submitted: {asg.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <span className="px-3 py-1 bg-white dark:bg-[#1B1F26] border-2 border-black rounded-xl text-xs font-black text-[var(--text-primary)] shadow-[1px_1px_0px_0px_#000]">
                        Score: {asg.score} / {asg.maxScore}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                        asg.status === 'Graded'
                          ? 'bg-brand-green/20 text-brand-green'
                          : asg.status === 'Submitted'
                          ? 'bg-brand-blue/20 text-brand-blue'
                          : 'bg-brand-pink/20 text-brand-pink'
                      }`}>
                        {asg.status}
                      </span>
                    </div>
                  </div>

                  {asg.feedback && (
                    <div className="p-2.5 bg-white dark:bg-[#1B1F26] rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">Evaluator Feedback:</strong> {asg.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Attendance Session History */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-blue text-white border-2 border-black flex items-center justify-center font-black">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="font-black font-display text-base text-[var(--text-primary)]">
                    Class Attendance Ledger
                  </h3>
                  <p className="text-xs font-bold text-gray-500">Recent lecture & lab biometric punch</p>
                </div>
              </div>

              <span className="text-xs font-bold text-gray-500">
                {student.recentSessions.length} sessions logged
              </span>
            </div>

            <div className="space-y-2.5">
              {student.recentSessions.map((sess, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-[#15181D] border-2 border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-between gap-3 text-xs hover:border-black transition-all"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-gray-600 dark:text-gray-400">
                        {sess.date}
                      </span>
                      <span className="px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded font-black text-[10px] uppercase">
                        {sess.type}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {sess.room}
                      </span>
                    </div>
                    <p className="font-extrabold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">
                      {sess.topic}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl font-black text-[11px] shrink-0 border ${
                    sess.status === 'Present'
                      ? 'bg-brand-green/20 text-green-700 dark:text-green-300 border-green-500/30'
                      : sess.status === 'On Duty'
                      ? 'bg-brand-blue/20 text-blue-700 dark:text-blue-300 border-blue-500/30'
                      : 'bg-brand-pink/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  }`}>
                    {sess.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Profile Details Card */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <h3 className="font-black font-display text-base text-[var(--text-primary)] flex items-center gap-2">
              <User size={18} className="text-brand-pink" />
              <span>ERP Profile Information</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10 flex justify-between items-center">
                <span className="font-bold text-gray-500">Student Roll Number</span>
                <span className="font-mono font-black text-[var(--text-primary)]">{student.id}</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10 flex justify-between items-center">
                <span className="font-bold text-gray-500">Institutional Email</span>
                <span className="font-black text-brand-blue">{student.email}</span>
              </div>

              {student.phone && (
                <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10 flex justify-between items-center">
                  <span className="font-bold text-gray-500">Contact Number</span>
                  <span className="font-mono font-black text-[var(--text-primary)]">{student.phone}</span>
                </div>
              )}

              {student.bloodGroup && (
                <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10 flex justify-between items-center">
                  <span className="font-bold text-gray-500">Blood Group</span>
                  <span className="font-black text-brand-pink">{student.bloodGroup}</span>
                </div>
              )}

              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10 flex justify-between items-center">
                <span className="font-bold text-gray-500">Section Allocation</span>
                <span className="font-black text-[var(--text-primary)]">{student.section}</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10 flex justify-between items-center">
                <span className="font-bold text-gray-500">Assigned Counselor</span>
                <span className="font-black text-[var(--text-primary)]">{student.advisor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
