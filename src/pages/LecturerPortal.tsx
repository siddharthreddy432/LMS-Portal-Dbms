import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  UploadCloud,
  FileText,
  PlusCircle,
  Megaphone,
  BookOpen,
  Users,
  Award,
  Download,
  Trash2,
  Pin,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { LMSResource, LMSAssignment, LMSSubmission } from '../types/lms';
import UploadResourceModal from '../components/lms/UploadResourceModal';
import FilePreviewModal from '../components/lms/FilePreviewModal';
import CreateAssignmentModal from '../components/lms/CreateAssignmentModal';
import CreateAnnouncementModal from '../components/lms/CreateAnnouncementModal';
import GradeSubmissionModal from '../components/lms/GradeSubmissionModal';
import StudentRecordModal, { StudentRecordData } from '../components/lms/StudentRecordModal';
import { STUDENT_COHORT_RECORDS } from '../data/studentRecords';
import { Link, useNavigate } from 'react-router-dom';

export default function LecturerPortal() {
  const navigate = useNavigate();
  const {
    courses,
    resources,
    assignments,
    announcements,
    lecturers,
    activeLecturer,
    setActiveLecturerId,
    deleteResource,
    togglePinResource,
    downloadResource,
    deleteAnnouncement
  } = useLMS();

  const [activeTab, setActiveTab] = useState<'materials' | 'assignments' | 'announcements' | 'students' | 'schedule'>('materials');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<LMSResource | null>(null);
  const [gradingState, setGradingState] = useState<{ assignment: LMSAssignment; submission: LMSSubmission } | null>(null);
  const [selectedStudentRecord, setSelectedStudentRecord] = useState<StudentRecordData | null>(null);

  // Filter resources
  const filteredResources = resources.filter(res => {
    const matchesCourse = courseFilter === 'all' || res.courseCode === courseFilter;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  // Filter assignments
  const filteredAssignments = assignments.filter(asg => {
    const matchesCourse = courseFilter === 'all' || asg.courseCode === courseFilter;
    return matchesCourse;
  });

  // Filter announcements
  const filteredAnnouncements = announcements.filter(ann => {
    return courseFilter === 'all' || !ann.courseCode || ann.courseCode === courseFilter;
  });

  // Stats
  const totalDownloads = resources.reduce((acc, curr) => acc + curr.downloadCount, 0);
  const totalSubmissions = assignments.reduce((acc, curr) => acc + curr.submissions.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Top Hero Banner - Faculty LMS Command Center (Compact & Streamlined) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-yellow border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-black text-white text-[11px] font-black uppercase tracking-wider rounded-md">
                🎓 Faculty & Lecturer Portal
              </span>
              <span className="px-2 py-0.5 bg-brand-pink text-white text-[11px] font-black rounded-md border border-black">
                Live LMS Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-black tracking-tight leading-tight">
              Lecturer Control Center
            </h1>
            <p className="text-black/80 font-bold text-xs sm:text-sm mt-0.5 max-w-xl">
              Publish learning resources, upload lecture slides, create assignments, evaluate student submissions, and broadcast notices in real time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const targetUrl = courseFilter !== 'all' ? `/upload?course=${courseFilter}` : '/upload';
                navigate(targetUrl);
              }}
              className="px-3.5 py-2 bg-brand-pink text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <UploadCloud size={15} />
              <span>Upload Material</span>
            </button>

            <button
              onClick={() => {
                const targetUrl = courseFilter !== 'all' ? `/create-assignment?course=${courseFilter}` : '/create-assignment';
                navigate(targetUrl);
              }}
              className="px-3.5 py-2 bg-brand-purple text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={15} />
              <span>New Assignment</span>
            </button>

            <button
              onClick={() => {
                const targetUrl = courseFilter !== 'all' ? `/post-announcement?course=${courseFilter}` : '/post-announcement';
                navigate(targetUrl);
              }}
              className="px-3.5 py-2 bg-brand-orange text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <Megaphone size={15} />
              <span>Post Announcement</span>
            </button>

            <Link
              to="/courses"
              className="px-3.5 py-2 bg-white text-black border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <Eye size={14} />
              <span>Student View</span>
            </Link>
          </div>
        </div>

        {/* Faculty Profile Switcher Bar */}
        <div className="mt-4 pt-3 border-t-2 border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#000] text-black">
              {activeLecturer.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black uppercase text-black/70 text-[10px]">Logged in Faculty:</span>
                <span className="font-black text-xs text-black">{activeLecturer.name}</span>
              </div>
              <p className="text-[11px] font-bold text-black/80">
                {activeLecturer.title} • {activeLecturer.cabin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">Switch Profile:</span>
            <select
              value={activeLecturer.id}
              onChange={(e) => setActiveLecturerId(e.target.value)}
              className="bg-white border-2 border-black rounded-lg px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            >
              {lecturers.map(lec => (
                <option key={lec.id} value={lec.id}>
                  {lec.name} ({lec.assignedCourseCodes.join(', ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Cards - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Materials</span>
            <FileText size={16} className="text-brand-pink" />
          </div>
          <p className="text-xl font-black font-display text-[var(--text-primary)]">{resources.length}</p>
          <p className="text-[11px] font-bold text-gray-500">{totalDownloads} student downloads</p>
        </div>

        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Courses</span>
            <BookOpen size={16} className="text-brand-blue" />
          </div>
          <p className="text-xl font-black font-display text-[var(--text-primary)]">{courses.length}</p>
          <p className="text-[11px] font-bold text-gray-500">Even Semester 24-25</p>
        </div>

        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Submissions</span>
            <Award size={16} className="text-brand-green" />
          </div>
          <p className="text-xl font-black font-display text-[var(--text-primary)]">{totalSubmissions}</p>
          <p className="text-[11px] font-bold text-gray-500">Ready for grading</p>
        </div>

        <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">Announcements</span>
            <Megaphone size={16} className="text-brand-orange" />
          </div>
          <p className="text-xl font-black font-display text-[var(--text-primary)]">{announcements.length}</p>
          <p className="text-[11px] font-bold text-gray-500">Broadcasts live</p>
        </div>
      </div>

      {/* Main Tab Controls & Filter Bar - Compact, No Overflow, Zero Scrollbar */}
      <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Navigation Tabs - Flexible wrap, compact padding */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 rounded-lg font-black text-xs border-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'materials'
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black/30'
            }`}
          >
            <FileText size={14} />
            <span>Materials</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'materials' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              {resources.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3 py-1.5 rounded-lg font-black text-xs border-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'assignments'
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black/30'
            }`}
          >
            <Award size={14} />
            <span>Assignments</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'assignments' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              {assignments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-lg font-black text-xs border-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black/30'
            }`}
          >
            <Megaphone size={14} />
            <span>Announcements</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'announcements' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              {announcements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg font-black text-xs border-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black/30'
            }`}
          >
            <Users size={14} />
            <span>Students</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-lg font-black text-xs border-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black/30'
            }`}
          >
            <Calendar size={14} />
            <span>Schedule</span>
          </button>
        </div>

        {/* Filter & Search - Responsive & compact */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-lg px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-lg pl-7 pr-2.5 py-1 text-xs font-bold text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* TAB CONTENT: 1. Course Materials & Files Hub */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* File Upload Action Box */}
          <div className="bg-brand-pink/10 border-3 border-dashed border-brand-pink rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-brand-pink text-white border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000] mb-3 transform -rotate-3">
              <UploadCloud size={28} />
            </div>
            <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
              Add New Course Material or Lecture File
            </h3>
            <p className="text-sm font-medium text-[var(--text-secondary)] max-w-md mt-1">
              Upload PDF handouts, PowerPoint slides, lab manuals, or code files. Once added, they will be instantly viewable and downloadable by both lecturers and students.
            </p>
            <button
              onClick={() => {
                const targetUrl = courseFilter !== 'all' ? `/upload?course=${courseFilter}` : '/upload';
                navigate(targetUrl);
              }}
              className="mt-4 px-6 py-2.5 bg-brand-pink text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <UploadCloud size={18} />
              <span>Select File & Upload</span>
            </button>
          </div>

          {/* Uploaded Materials List / Table */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                  Course Learning Files & Materials
                </h3>
                <p className="text-xs font-bold text-[var(--text-secondary)]">
                  Showing {filteredResources.length} resources viewable by faculty and students
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const targetUrl = courseFilter !== 'all' ? `/upload?course=${courseFilter}` : '/upload';
                    navigate(targetUrl);
                  }}
                  className="px-3.5 py-1.5 bg-brand-yellow text-black border-2 border-black rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-400 flex items-center gap-1.5"
                >
                  <UploadCloud size={14} />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-bold">
                No materials match the filter criteria. Click "Upload File" to add one!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map(resource => (
                  <motion.div
                    key={resource.id}
                    layout
                    className={`bg-white dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] ${
                      resource.pinned ? 'ring-2 ring-brand-yellow bg-brand-yellow/5' : ''
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-black px-2 py-0.5 bg-black text-white rounded">
                            {resource.courseCode}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-brand-yellow text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            {resource.unit}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-brand-pink/15 text-brand-pink border border-brand-pink/30 rounded">
                            {resource.category}
                          </span>
                        </div>

                        {resource.pinned && (
                          <span className="flex items-center gap-1 text-[11px] font-black text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full border border-brand-pink/30">
                            <Pin size={11} className="fill-brand-pink" /> Pinned
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-extrabold text-base text-[var(--text-primary)] leading-snug">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                        {resource.description}
                      </p>

                      {/* File metadata */}
                      <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 font-bold">
                        <span className="truncate max-w-[180px]">{resource.fileName} ({resource.fileSize})</span>
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/preview/${resource.id}`)}
                          className="px-3 py-1 bg-white dark:bg-[#1B1F26] border-2 border-black rounded-lg text-xs font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => downloadResource(resource)}
                          className="px-3 py-1 bg-brand-green text-black border-2 border-black rounded-lg text-xs font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] hover:bg-green-400"
                        >
                          <Download size={13} />
                          <span>Download</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePinResource(resource.id)}
                          className="p-1.5 border-2 border-black rounded-lg hover:bg-brand-yellow transition-colors shadow-[1px_1px_0px_0px_#000]"
                          title="Pin/Unpin resource"
                        >
                          <Pin size={13} className={resource.pinned ? 'fill-black' : ''} />
                        </button>
                        <button
                          onClick={() => deleteResource(resource.id)}
                          className="p-1.5 border-2 border-black rounded-lg text-brand-red hover:bg-brand-red hover:text-white transition-colors shadow-[1px_1px_0px_0px_#000]"
                          title="Delete file"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Assignments & Submissions Hub */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-black font-display text-[var(--text-primary)]">
                Assignments & Grading Queue
              </h3>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Review submitted student solutions, verify code and test cases, award marks, and provide written feedback.
              </p>
            </div>
            <button
              onClick={() => {
                const targetUrl = courseFilter !== 'all' ? `/create-assignment?course=${courseFilter}` : '/create-assignment';
                navigate(targetUrl);
              }}
              className="px-5 py-2.5 bg-brand-purple text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>+ Create Assignment</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredAssignments.map(asg => (
              <div
                key={asg.id}
                className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black/10 dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-black px-2 py-0.5 bg-black text-white rounded">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-brand-purple/20 text-brand-purple border border-brand-purple/40 rounded">
                        {asg.unit || 'Module Task'}
                      </span>
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-2">
                        <Clock size={13} /> Due: {asg.dueDate}
                      </span>
                    </div>
                    <h4 className="text-xl font-black font-display text-[var(--text-primary)]">
                      {asg.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] mt-1">
                      {asg.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-brand-yellow/30 border-2 border-black rounded-xl px-4 py-2 text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 block">Submissions</span>
                      <span className="text-xl font-black text-black dark:text-white">
                        {asg.submissions.length} / {asg.submissionsCount || 45}
                      </span>
                    </div>

                    <div className="bg-brand-green/30 border-2 border-black rounded-xl px-4 py-2 text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 block">Max Score</span>
                      <span className="text-xl font-black text-black dark:text-white">{asg.maxMarks}</span>
                    </div>
                  </div>
                </div>

                {/* Submissions Section */}
                <div className="mt-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                    Student Submissions To Evaluate ({asg.submissions.length})
                  </h5>

                  {asg.submissions.length === 0 ? (
                    <div className="p-6 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-center text-xs font-bold text-gray-400">
                      No submissions received for this assignment yet. Submissions will appear here once students upload files.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {asg.submissions.map(sub => (
                        <div
                          key={sub.id}
                          className="bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#000]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-black text-sm flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                              {sub.studentName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-[var(--text-primary)]">{sub.studentName}</span>
                                <span className="text-xs font-mono font-bold text-gray-400">({sub.studentId})</span>
                              </div>
                              <p className="text-xs font-bold text-gray-500 flex items-center gap-2 mt-0.5">
                                <FileText size={12} className="text-brand-pink" />
                                <span>{sub.fileName} ({sub.fileSize || '120 KB'})</span>
                                <span>•</span>
                                <span>Submitted: {sub.submittedAt}</span>
                              </p>
                              {sub.remarks && (
                                <p className="text-xs italic text-gray-600 dark:text-gray-300 mt-1">
                                  Notes: "{sub.remarks}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            {sub.status === 'graded' ? (
                              <div className="bg-brand-green/20 border-2 border-green-500 rounded-xl px-3 py-1 text-center">
                                <span className="text-[10px] font-black uppercase text-green-700 dark:text-green-300 block">Graded</span>
                                <span className="text-sm font-black text-green-800 dark:text-green-200">{sub.grade} / {asg.maxMarks}</span>
                              </div>
                            ) : (
                              <span className="px-2.5 py-1 bg-brand-yellow text-black border border-black rounded-lg text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                                Pending Evaluation
                              </span>
                            )}

                            <button
                              onClick={() => setGradingState({ assignment: asg, submission: sub })}
                              className="px-3.5 py-1.5 bg-brand-yellow text-black border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                            >
                              <Award size={14} />
                              <span>{sub.status === 'graded' ? 'Re-Grade' : 'Grade Submission'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Announcements Hub */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-black font-display text-[var(--text-primary)]">
                Faculty Broadcasts & Notices
              </h3>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Publish exam blueprints, lab session updates, room shifts, or general academic announcements.
              </p>
            </div>
            <button
              onClick={() => {
                const targetUrl = courseFilter !== 'all' ? `/post-announcement?course=${courseFilter}` : '/post-announcement';
                navigate(targetUrl);
              }}
              className="px-5 py-2.5 bg-brand-orange text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Megaphone size={18} />
              <span>+ Post Announcement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAnnouncements.map(ann => (
              <div
                key={ann.id}
                className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-black uppercase border border-black ${
                      ann.priority === 'urgent'
                        ? 'bg-brand-red text-white'
                        : ann.priority === 'important'
                        ? 'bg-brand-yellow text-black'
                        : 'bg-brand-blue text-white'
                    }`}>
                      {ann.priority.toUpperCase()}
                    </span>

                    {ann.courseCode && (
                      <span className="text-xs font-black px-2 py-0.5 bg-black text-white rounded">
                        {ann.courseCode}
                      </span>
                    )}

                    <span className="text-xs font-bold text-gray-400">
                      {ann.date} • by {ann.author} ({ann.authorRole})
                    </span>
                  </div>

                  <h4 className="text-lg font-black font-display text-[var(--text-primary)]">
                    {ann.title}
                  </h4>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    {ann.content}
                  </p>

                  {ann.attachment && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-black/20 rounded-xl text-xs font-bold">
                      <FileText size={14} className="text-brand-pink" />
                      <span>{ann.attachment.name}</span>
                      <span className="text-gray-400">({ann.attachment.size})</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-2 border-2 border-black rounded-xl text-brand-red hover:bg-brand-red hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000] self-start"
                  title="Delete notice"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. Enrolled Students */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000]">
            <h3 className="text-xl font-black font-display text-[var(--text-primary)] mb-2">
              Student Roster - {activeLecturer.name}'s Batches
            </h3>
            <p className="text-xs font-bold text-gray-500 mb-6">
              Track attendance standing, submission compliance, and direct academic contact for enrolled students.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-black dark:border-white/20 text-xs font-black uppercase text-gray-500">
                    <th className="pb-3 pl-2">Student Name</th>
                    <th className="pb-3">Roll Number</th>
                    <th className="pb-3">Enrolled Course</th>
                    <th className="pb-3">Attendance</th>
                    <th className="pb-3">Submissions</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10 text-xs sm:text-sm font-bold">
                  {STUDENT_COHORT_RECORDS.map((st) => (
                    <tr key={st.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 pl-2 font-extrabold text-[var(--text-primary)]">{st.name}</td>
                      <td className="py-3 font-mono text-gray-500">{st.id}</td>
                      <td className="py-3 text-[var(--text-primary)]">{st.course}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-black border ${
                          st.att >= 85
                            ? 'bg-brand-green/20 text-green-700 dark:text-green-300 border-green-500/30'
                            : st.att >= 75
                            ? 'bg-brand-yellow/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                            : 'bg-brand-pink/20 text-rose-700 dark:text-rose-300 border-rose-500/30'
                        }`}>
                          {st.att}%
                        </span>
                      </td>
                      <td className="py-3 text-brand-pink font-extrabold">{st.sub} Completed</td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/student-record/${st.id}`)}
                          className="px-2.5 py-1 bg-white dark:bg-[#15181D] border-2 border-black rounded-lg text-xs font-black shadow-[1px_1px_0px_0px_#000] hover:bg-brand-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all text-[var(--text-primary)]"
                          title="Open Full Student Record Page"
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. Schedule & Office Hours */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000]">
            <h3 className="text-xl font-black font-display text-[var(--text-primary)] mb-1">
              Weekly Lecture Timetable
            </h3>
            <p className="text-xs font-bold text-gray-500 mb-4">Classroom allocations and skilling lab slots</p>

            <div className="space-y-3">
              {[
                { day: 'Monday', time: '09:00 - 10:40 AM', course: '25SC1204E Data Structures', room: 'Lecture Hall 201' },
                { day: 'Monday', time: '02:00 - 03:40 PM', course: '25CS1302E Database Systems', room: 'Lecture Hall 302' },
                { day: 'Wednesday', time: '01:30 - 03:10 PM', course: '25SC1204E DSA Lab Practical', room: 'Computing Lab 4' },
                { day: 'Friday', time: '10:00 - 11:40 AM', course: '25CS1302E Database Lab', room: 'DB Lab Block A' }
              ].map((slot, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 dark:bg-white/5 border-2 border-black rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-brand-pink block">{slot.day} • {slot.time}</span>
                    <span className="font-extrabold text-sm text-[var(--text-primary)]">{slot.course}</span>
                  </div>
                  <span className="text-xs font-bold bg-brand-yellow text-black px-2 py-0.5 rounded border border-black">
                    {slot.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 shadow-[5px_5px_0px_0px_#000]">
            <h3 className="text-xl font-black font-display text-[var(--text-primary)] mb-1">
              Faculty Office & Consultation Hours
            </h3>
            <p className="text-xs font-bold text-gray-500 mb-4">Dedicated hours for student doubt clearance & thesis mentoring</p>

            <div className="bg-brand-blue/15 border-2 border-brand-blue rounded-2xl p-4 mb-4">
              <span className="text-xs font-black uppercase text-brand-blue block mb-1">Standard Office Hours</span>
              <p className="text-base font-black text-[var(--text-primary)]">{activeLecturer.officeHours}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">Location: {activeLecturer.cabin}</p>
            </div>

            <div className="space-y-2 text-xs font-bold text-[var(--text-secondary)]">
              <p>• Students are encouraged to bring test cases and questions.</p>
              <p>• For urgent project evaluation, contact via institutional email: <strong className="text-brand-pink">{activeLecturer.email}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadResourceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultCourseCode={courseFilter !== 'all' ? courseFilter : undefined}
      />

      <FilePreviewModal
        resource={previewResource}
        isOpen={!!previewResource}
        onClose={() => setPreviewResource(null)}
      />

      <CreateAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
        defaultCourseCode={courseFilter !== 'all' ? courseFilter : undefined}
      />

      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        defaultCourseCode={courseFilter !== 'all' ? courseFilter : undefined}
      />

      {gradingState && (
        <GradeSubmissionModal
          assignment={gradingState.assignment}
          submission={gradingState.submission}
          isOpen={!!gradingState}
          onClose={() => setGradingState(null)}
        />
      )}

      <StudentRecordModal
        student={selectedStudentRecord}
        isOpen={!!selectedStudentRecord}
        onClose={() => setSelectedStudentRecord(null)}
      />
    </div>
  );
}
