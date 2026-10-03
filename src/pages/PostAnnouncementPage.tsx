import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Megaphone,
  BookOpen,
  Calendar,
  Clock,
  UploadCloud,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Send,
  X,
  Bell,
  Users,
  ShieldAlert,
  Flame,
  Info
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLMS } from '../context/LMSContext';

export default function PostAnnouncementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get('course');

  const { courses, activeLecturer, createAnnouncement, announcements } = useLMS();

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    courseParam && courses.some(c => c.code === courseParam) ? courseParam : 'all'
  );

  useEffect(() => {
    if (courseParam && courses.some(c => c.code === courseParam)) {
      setSelectedCourseCode(courseParam);
    }
  }, [courseParam, courses]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'important' | 'general'>('important');

  // Attachment state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedFileSize, setAttachedFileSize] = useState('');
  const [attachedFileDataUrl, setAttachedFileDataUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const selectedCourseObj = selectedCourseCode !== 'all'
    ? courses.find(c => c.code === selectedCourseCode)
    : undefined;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setAttachedFile(file);
    setAttachedFileName(file.name);
    setAttachedFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFileDataUrl(event.target?.result as string || '');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Quick preset templates
  const applyPreset = (presetTitle: string, presetPriority: 'urgent' | 'important' | 'general', presetBody: string) => {
    setTitle(presetTitle);
    setPriority(presetPriority);
    setContent(presetBody);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the announcement.');
      return;
    }
    if (!content.trim()) {
      setError('Please enter the announcement body content.');
      return;
    }

    createAnnouncement({
      courseId: selectedCourseObj?.id,
      courseCode: selectedCourseObj?.code,
      courseName: selectedCourseObj?.name,
      title: title.trim(),
      content: content.trim(),
      author: activeLecturer.name,
      authorRole: activeLecturer.title,
      authorAvatar: activeLecturer.avatar,
      priority,
      attachment: attachedFileName ? {
        name: attachedFileName,
        size: attachedFileSize || '650 KB',
        url: attachedFileDataUrl || undefined
      } : undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      navigate('/lecturers');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/lecturers"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-50 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back to Lecturer Portal</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500">Broadcasting As:</span>
          <span className="text-xs font-black px-2 py-0.5 bg-brand-orange/20 text-brand-orange rounded-md border border-brand-orange/30">
            {activeLecturer.name} ({activeLecturer.title})
          </span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-brand-orange text-white border-3 border-black rounded-3xl p-5 sm:p-7 shadow-[5px_5px_0px_0px_#000] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-black text-white text-[11px] font-black uppercase tracking-wider rounded-md">
                📢 Faculty Broadcast Station
              </span>
              <span className="px-2 py-0.5 bg-white text-black text-[11px] font-black rounded-md">
                Full-Screen Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight">
              Post Class Announcement
            </h1>
            <p className="text-white/95 font-medium text-xs sm:text-sm mt-1 max-w-2xl">
              Broadcast critical course notices, lab updates, exam blueprints, class schedule changes, and guest lecture invitations directly to your students.
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white text-black border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] transform rotate-3 shrink-0">
            <Megaphone size={32} className="text-brand-orange" />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-brand-green text-white border-2 border-black rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_#000] flex items-center gap-3"
          >
            <CheckCircle2 size={22} className="shrink-0" />
            <div>
              <p className="font-black text-base">Announcement Broadcast Live!</p>
              <p className="text-xs font-bold text-white/90">
                Notice delivered to student dashboards and course noticeboards. Redirecting to Lecturer Portal...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-brand-red text-white border-2 border-black rounded-xl font-bold text-xs shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-black/20 rounded">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-Column Layout: Form on Left (60%), Live Student Preview on Right (40%) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Audience & Priority */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h2 className="text-base font-black font-display text-[var(--text-primary)] flex items-center gap-2">
              <Users size={18} className="text-brand-orange" />
              <span>1. Target Audience & Urgency</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Target Course
                </label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="all">📢 All Enrolled Students & General Broadcast</option>
                  {courses.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Priority Badge
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPriority('urgent')}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-black border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                      priority === 'urgent'
                        ? 'bg-brand-red text-white border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-gray-50 dark:bg-[#15181D] text-gray-600 dark:text-gray-300 border-black/20 hover:border-black'
                    }`}
                  >
                    <Flame size={13} />
                    <span>Urgent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('important')}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-black border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                      priority === 'important'
                        ? 'bg-brand-orange text-white border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-gray-50 dark:bg-[#15181D] text-gray-600 dark:text-gray-300 border-black/20 hover:border-black'
                    }`}
                  >
                    <Bell size={13} />
                    <span>Important</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('general')}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-black border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                      priority === 'general'
                        ? 'bg-brand-blue text-white border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-gray-50 dark:bg-[#15181D] text-gray-600 dark:text-gray-300 border-black/20 hover:border-black'
                    }`}
                  >
                    <Info size={13} />
                    <span>General</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Templates Selector */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1.5">
                Quick Template Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset(
                    'Mid-Term Lab Exam Timetable & Guidelines Released',
                    'urgent',
                    'All students must report to their assigned practical labs 15 minutes before scheduled slot with university identity card and updated lab record.'
                  )}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-[11px] font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  ⏱ Lab Exam Schedule
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(
                    'Deadline Extension for Course Project Submission',
                    'important',
                    'In response to student requests, the final project submission window has been extended by 48 hours. Please ensure your GitHub repository and report are pushed.'
                  )}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-[11px] font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  📅 Deadline Extension
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(
                    'Guest Lecture: Industry Architect on Scalable Systems',
                    'general',
                    'We are thrilled to host a guest lecture session this Friday at 3:00 PM in the Auditorium. Attendance is highly encouraged for all registered students.'
                  )}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-[11px] font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  🎓 Guest Lecture
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Announcement Title & Message Content */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h2 className="text-base font-black font-display text-[var(--text-primary)] flex items-center gap-2">
              <FileText size={18} className="text-brand-pink" />
              <span>2. Notice Content</span>
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Announcement Headline / Title <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mid-Term Lab Exam Timetable & Room Allocations"
                className="w-full bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-primary)] focus:outline-none placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Detailed Message Content <span className="text-brand-pink">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write the complete announcement details, instructions, room shifts, timings, requirements, or links..."
                className="w-full bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-xl p-3 text-xs font-medium text-[var(--text-primary)] focus:outline-none placeholder-gray-400 resize-none leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 3: Attachment (Circular / Timetable / Document) */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h2 className="text-base font-black font-display text-[var(--text-primary)] flex items-center gap-2">
              <UploadCloud size={18} className="text-brand-green" />
              <span>3. Optional Attachment (Circular / Schedule PDF)</span>
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {!attachedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-brand-orange bg-brand-orange/10'
                    : 'border-black/30 dark:border-white/20 hover:border-black dark:hover:border-white/40 bg-gray-50 dark:bg-[#15181D]'
                }`}
              >
                <UploadCloud size={28} className="mx-auto text-brand-orange mb-2" />
                <p className="font-black text-xs text-[var(--text-primary)]">
                  Click to attach notice document or drag & drop file
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  PDF circular, exam schedule image, or syllabus guide (up to 15 MB)
                </p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-[#171A20] border-2 border-black dark:border-white/20 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-xs text-[var(--text-primary)] truncate">
                      {attachedFileName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold">
                      {attachedFileSize}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAttachedFile(null);
                    setAttachedFileName('');
                  }}
                  className="p-1.5 text-gray-400 hover:text-brand-red rounded-lg transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Action Submit Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-brand-orange hover:brightness-110 text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>Broadcast Announcement Now</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/lecturers')}
              className="px-5 py-3 bg-white dark:bg-[#1B1F26] text-[var(--text-primary)] border-2 border-black dark:border-white/20 rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Live Preview Column (Sticky) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-brand-pink" />
                <h3 className="font-black font-display text-sm text-[var(--text-primary)]">
                  Live Noticeboard Preview
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-brand-green/20 text-brand-green rounded">
                Real-time
              </span>
            </div>

            {/* Preview Card */}
            <div className="border-2 border-black dark:border-white/15 rounded-2xl p-4 bg-gray-50 dark:bg-[#171A20] space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-black ${
                    priority === 'urgent'
                      ? 'bg-brand-red text-white'
                      : priority === 'important'
                      ? 'bg-brand-orange text-white'
                      : 'bg-brand-blue text-white'
                  }`}>
                    {priority.toUpperCase()}
                  </span>

                  {selectedCourseCode !== 'all' ? (
                    <span className="text-[10px] font-black px-1.5 py-0.2 bg-black text-white rounded font-mono">
                      {selectedCourseCode}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-1.5 py-0.2 bg-purple-600 text-white rounded">
                      ALL COURSES
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-gray-500">
                  {currentDateStr}
                </span>
              </div>

              <div>
                <h4 className="font-black text-base text-[var(--text-primary)] leading-tight">
                  {title || 'Headline will appear here...'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  By {activeLecturer.name} ({activeLecturer.title})
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#15181D] rounded-xl border border-black/10 text-xs text-gray-600 dark:text-gray-300 leading-relaxed min-h-[70px] whitespace-pre-line">
                {content || 'Your announcement message content will render here in real-time.'}
              </div>

              {attachedFileName && (
                <div className="p-2 bg-brand-orange/10 border border-brand-orange/30 rounded-lg flex items-center gap-2 text-xs font-bold text-brand-orange">
                  <FileText size={14} />
                  <span className="truncate">{attachedFileName}</span>
                </div>
              )}
            </div>

            {/* Broadcast Reach Info */}
            <div className="p-3 bg-brand-blue/10 border-2 border-black/15 rounded-xl space-y-1.5 text-xs text-black/80 dark:text-white/80">
              <p className="font-black text-black dark:text-white flex items-center gap-1">
                <Sparkles size={14} className="text-brand-blue" />
                Live Broadcast Channel:
              </p>
              <ul className="list-disc list-inside space-y-1 font-medium text-[11px]">
                <li>Appears at the top of the Student Dashboard announcement feed.</li>
                <li>Displays inside the respective course portal noticeboard.</li>
                <li>Students receive notification badges on active broadcast.</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
