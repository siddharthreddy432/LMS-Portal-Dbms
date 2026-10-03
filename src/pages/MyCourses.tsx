import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  FileText,
  UploadCloud,
  Download,
  Eye,
  Award,
  Megaphone,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Pin,
  Calendar,
  Send,
  User,
  GraduationCap
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { LMSResource, LMSCourse, LMSAssignment } from '../types/lms';
import UploadResourceModal from '../components/lms/UploadResourceModal';
import FilePreviewModal from '../components/lms/FilePreviewModal';
import AssignmentSubmitModal from '../components/lms/AssignmentSubmitModal';
import { Link, useNavigate } from 'react-router-dom';

export default function MyCourses() {
  const navigate = useNavigate();
  const {
    courses,
    resources,
    assignments,
    announcements,
    discussions,
    activeLecturer,
    downloadResource,
    addDiscussion,
    addDiscussionReply
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'materials' | 'courses' | 'assignments' | 'announcements' | 'doubts'>('materials');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [previewResource, setPreviewResource] = useState<LMSResource | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [submitAssignmentTarget, setSubmitAssignmentTarget] = useState<LMSAssignment | null>(null);

  // New doubt state
  const [newQuestionCourse, setNewQuestionCourse] = useState('25SC1204E');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  // Filtered resources - memoized
  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return resources.filter(res => {
      if (selectedCourseFilter !== 'all' && res.courseCode !== selectedCourseFilter) return false;
      if (selectedTypeFilter !== 'all' && res.fileType !== selectedTypeFilter) return false;
      if (q) {
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchDesc = res.description.toLowerCase().includes(q);
        const matchCourse = res.courseCode.toLowerCase().includes(q);
        const matchTag = res.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCourse && !matchTag) return false;
      }
      return true;
    });
  }, [resources, selectedCourseFilter, selectedTypeFilter, searchQuery]);

  // Filtered assignments - memoized
  const filteredAssignments = useMemo(() => {
    return assignments.filter(asg => {
      if (selectedCourseFilter !== 'all' && asg.courseCode !== selectedCourseFilter) return false;
      return true;
    });
  }, [assignments, selectedCourseFilter]);

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;

    addDiscussion({
      courseId: courses.find(c => c.code === newQuestionCourse)?.id || 'c-dsa',
      courseCode: newQuestionCourse,
      title: newQuestionTitle,
      content: newQuestionContent,
      author: 'Siddharth Reddy',
      authorRole: 'student',
      tags: [newQuestionCourse, 'Coursework']
    });

    setNewQuestionTitle('');
    setNewQuestionContent('');
  };

  const handleSendReply = (discussionId: string) => {
    const text = replyInput[discussionId];
    if (!text || !text.trim()) return;
    addDiscussionReply(discussionId, text.trim());
    setReplyInput(prev => ({ ...prev, [discussionId]: '' }));
  };

  const getFormatBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 px-2 py-0.5 rounded">PDF</span>;
      case 'ppt':
        return <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 px-2 py-0.5 rounded">SLIDES</span>;
      case 'code':
        return <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 px-2 py-0.5 rounded">CODE</span>;
      default:
        return <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded">DOC</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner - Clean University Repository Header */}
      <div className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md">
                Coursework Repository
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-md">
                Semester II Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Courses & Academic Repository
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Access enrolled subjects, syllabus units, lecture slides, question banks, and upload course documents accessible to students and faculty.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                const targetUrl = selectedCourseFilter !== 'all' ? `/upload?course=${selectedCourseFilter}` : '/upload';
                navigate(targetUrl);
              }}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
            >
              <UploadCloud size={15} />
              <span>Upload Course File</span>
            </button>

            <Link
              to="/lecturers"
              className="px-4 py-2 bg-gray-100 dark:bg-[#22262E] text-[var(--text-primary)] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold hover:bg-gray-200 dark:hover:bg-[#2B303A] transition-colors flex items-center gap-1.5"
            >
              <GraduationCap size={15} />
              <span>Faculty Portal</span>
            </Link>
          </div>
        </div>

        {/* Clean Numerical Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Registered Courses</span>
            <span className="text-xl font-semibold text-[var(--text-primary)] tabular-nums">{courses.length} Subjects</span>
          </div>

          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Available Resources</span>
            <span className="text-xl font-semibold text-[var(--text-primary)] tabular-nums">{resources.length} Documents</span>
          </div>

          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Active Assignments</span>
            <span className="text-xl font-semibold text-[var(--text-primary)] tabular-nums">{assignments.length} Tasks</span>
          </div>

          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Official Notices</span>
            <span className="text-xl font-semibold text-[var(--text-primary)] tabular-nums">{announcements.length} Published</span>
          </div>
        </div>
      </div>

      {/* Main Tab Controls & Filter Bar */}
      <div className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'materials'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText size={14} /> Course Materials ({resources.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'courses'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} /> Registered Courses ({courses.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'assignments'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Award size={14} /> Assignments ({assignments.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'announcements'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Megaphone size={14} /> Notices ({announcements.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'doubts'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare size={14} /> Doubt Forum ({discussions.length})
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/20"
          >
            <option value="all">All Subjects</option>
            {courses.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>

          {activeTab === 'materials' && (
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/20"
            >
              <option value="all">All Formats</option>
              <option value="pdf">PDF Documents</option>
              <option value="ppt">Slide Decks</option>
              <option value="code">Code Archives</option>
            </select>
          )}

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg pl-7 pr-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/20 w-32 sm:w-40"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: Shared Course Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-5">
          {/* Quick upload card */}
          <div className="bg-gray-50 dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-200/70 dark:bg-white/10 text-[var(--text-primary)] flex items-center justify-center flex-shrink-0">
                <UploadCloud size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Add Learning Materials & Reference Documents
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                  Files added here are immediately indexed for student previews and batch downloads.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const targetUrl = selectedCourseFilter !== 'all' ? `/upload?course=${selectedCourseFilter}` : '/upload';
                navigate(targetUrl);
              }}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto flex items-center gap-1.5 flex-shrink-0"
            >
              <UploadCloud size={14} />
              <span>Add Resource</span>
            </button>
          </div>

          {/* Grid of Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:border-gray-300 dark:hover:border-white/20 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getFormatBadge(resource.fileType)}
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {resource.courseCode}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600 font-light" aria-hidden="true">·</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {resource.unit}
                      </span>
                    </div>

                    {resource.pinned && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-base text-[var(--text-primary)] leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="truncate max-w-[200px]">By {resource.uploadedBy}</span>
                    <span className="tabular-nums">{resource.fileSize} · {resource.downloadCount} downloads</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Updated {resource.uploadedAt}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/preview/${resource.id}`)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-[#22262E] hover:bg-gray-200 dark:hover:bg-[#2B303A] text-[var(--text-primary)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => downloadResource(resource)}
                      className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="p-12 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#181B20]">
              <p className="text-sm font-medium text-gray-500">No resources match the selected criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Enrolled Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:border-gray-300 dark:hover:border-white/20 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[var(--text-primary)] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {course.credits} Credits · {course.academicYear}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-[var(--text-primary)]">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Instructor: {course.instructor.name}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-1">
                    <span>Syllabus Coverage</span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-black dark:bg-white h-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Units checklist */}
                <div className="mt-4 space-y-2 pt-3 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Course Units</span>
                  {course.syllabusUnits.map(u => (
                    <div key={u.unitNumber} className="flex items-center gap-2 text-xs font-medium">
                      {u.completed ? (
                        <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Clock size={13} className="text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`truncate ${u.completed ? 'text-gray-400 line-through' : 'text-[var(--text-primary)]'}`}>
                        Unit {u.unitNumber}: {u.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => {
                    setSelectedCourseFilter(course.code);
                    setActiveTab('materials');
                  }}
                  className="w-full py-2 bg-gray-100 dark:bg-[#22262E] hover:bg-gray-200 dark:hover:bg-[#2B303A] text-[var(--text-primary)] rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  View Course Materials
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Active Assignments & Problem Sets
              </h3>
              <p className="text-xs text-gray-500">
                Submit programming tasks, lab reports, and view faculty marks & comments.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAssignments.map(asg => {
              const mySub = asg.submissions.find(s => s.studentId === '2300030114');

              return (
                <div
                  key={asg.id}
                  className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-[var(--text-primary)] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                          {asg.courseCode}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {asg.unit || 'Assignment'}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600 font-light" aria-hidden="true">·</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                          <Clock size={12} /> Due: {asg.dueDate}
                        </span>
                      </div>

                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        {asg.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-3xl leading-relaxed">
                        {asg.description}
                      </p>

                      {asg.attachments && asg.attachments.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-gray-400">Attachments:</span>
                          {asg.attachments.map((att, i) => (
                            <span key={i} className="text-xs font-medium px-2 py-0.5 bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded flex items-center gap-1 text-[var(--text-primary)]">
                              <FileText size={12} />
                              <span>{att.name}</span>
                              <span className="text-gray-400">({att.size})</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2.5 flex-shrink-0">
                      {mySub ? (
                        mySub.status === 'graded' ? (
                          <div className="text-right">
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">Graded Score</span>
                            <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
                              {mySub.grade} / {asg.maxMarks}
                            </span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-[11px] font-medium text-gray-500 block">Status</span>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Submitted</span>
                          </div>
                        )
                      ) : (
                        <div className="text-right">
                          <span className="text-[11px] font-medium text-gray-400 block">Status</span>
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Submission</span>
                        </div>
                      )}

                      <button
                        onClick={() => setSubmitAssignmentTarget(asg)}
                        className="px-3.5 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                      >
                        <UploadCloud size={13} />
                        <span>{mySub ? 'Update Solution' : 'Submit Solution'}</span>
                      </button>
                    </div>
                  </div>

                  {mySub && mySub.feedback && (
                    <div className="mt-3.5 p-3 bg-gray-50 dark:bg-[#1E2228] border border-gray-200/80 dark:border-white/5 rounded-lg text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-0.5">Faculty Feedback:</span>
                      <p className="text-[var(--text-primary)] italic">"{mySub.feedback}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Official Department Notices & Broadcasts
            </h3>
            <span className="text-xs text-gray-500 font-medium">Showing {announcements.length} broadcasts</span>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                      {ann.courseCode}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600 font-light" aria-hidden="true">·</span>
                    <span className="text-xs text-gray-500 font-medium">
                      By {ann.author} ({ann.authorRole})
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 font-medium">
                    {ann.date}
                  </span>
                </div>

                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {ann.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {ann.content}
                </p>

                {ann.attachment && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center gap-1.5 text-xs font-medium text-[var(--text-primary)]">
                    <FileText size={13} className="text-gray-500" />
                    <span>Attached Document: {ann.attachment.name}</span>
                    <span className="text-gray-400">({ann.attachment.size})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Doubt Forum & Academic Help Desk */}
      {activeTab === 'doubts' && (
        <div className="space-y-5">
          {/* Institutional Academic Help Desk Banner - No AI prefixes, clean typography */}
          <div className="bg-[#111317] text-white border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/15 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Academic Help Desk & Doubt Resolution
                </h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Access immediate syllabus clarifications, code analysis, and step-by-step problem walkthroughs for all registered subjects.
                </p>
              </div>
            </div>

            <Link
              to="/help-desk"
              className="px-4 py-2 bg-white text-black rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0"
            >
              <BookOpen size={14} />
              <span>Open Help Desk</span>
            </Link>
          </div>

          {/* Ask Faculty/Peer Doubt */}
          <div className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
              Submit Course Query to Faculty & Class Peers
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Questions submitted here are reviewed by course instructors and fellow students.
            </p>

            <form onSubmit={handleCreateDoubt} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <select
                    value={newQuestionCourse}
                    onChange={(e) => setNewQuestionCourse(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--text-primary)] focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.code} value={c.code}>{c.code} · {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Topic Title (e.g. Inquiries regarding AVL Deletion Case 2)"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Explain the specific concept, formula step, or paste code snippet..."
                value={newQuestionContent}
                onChange={(e) => setNewQuestionContent(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Send size={12} />
                  <span>Post Doubt</span>
                </button>
              </div>
            </form>
          </div>

          {/* Discussion Threads */}
          <div className="space-y-3">
            {discussions.map(disc => (
              <div
                key={disc.id}
                className="bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)] bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                      {disc.courseCode}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600 font-light" aria-hidden="true">·</span>
                    <span className="text-xs text-gray-500 font-medium">
                      Asked by {disc.author} · {disc.createdAt}
                    </span>
                  </div>

                  {disc.resolved && (
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded text-xs font-semibold">
                      Answered by Faculty
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-base text-[var(--text-primary)]">
                  {disc.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {disc.content}
                </p>

                {/* Replies Thread */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 space-y-2">
                  {disc.replies.map(rep => (
                    <div
                      key={rep.id}
                      className={`p-3 rounded-lg border ${
                        rep.authorRole === 'lecturer'
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30'
                          : 'bg-gray-50 dark:bg-[#1E2228] border-gray-100 dark:border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                          {rep.author}
                          {rep.authorRole === 'lecturer' && (
                            <span className="px-1.5 py-0.2 bg-amber-200/60 dark:bg-amber-800/40 text-amber-900 dark:text-amber-200 rounded text-[10px] font-bold">
                              Instructor
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-gray-400">{rep.createdAt}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rep.content}</p>
                    </div>
                  ))}

                  {/* Add reply input */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write an academic response..."
                      value={replyInput[disc.id] || ''}
                      onChange={(e) => setReplyInput(prev => ({ ...prev, [disc.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendReply(disc.id);
                        }
                      }}
                      className="flex-1 bg-gray-50 dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendReply(disc.id)}
                      className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewResource && (
        <FilePreviewModal
          resource={previewResource}
          isOpen={!!previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}

      {/* Upload Resource Modal */}
      <UploadResourceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultCourseCode={selectedCourseFilter !== 'all' ? selectedCourseFilter : undefined}
      />

      {/* Submit Assignment Modal */}
      {submitAssignmentTarget && (
        <AssignmentSubmitModal
          assignment={submitAssignmentTarget}
          isOpen={!!submitAssignmentTarget}
          onClose={() => setSubmitAssignmentTarget(null)}
        />
      )}
    </div>
  );
}
