import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Megaphone, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseCode?: string;
}

export default function CreateAnnouncementModal({ isOpen, onClose, defaultCourseCode }: CreateAnnouncementModalProps) {
  const { courses, activeLecturer, createAnnouncement } = useLMS();

  const [selectedCourseCode, setSelectedCourseCode] = useState(defaultCourseCode || 'all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'important' | 'general'>('important');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide both an announcement title and message content.');
      return;
    }

    const courseObj = selectedCourseCode !== 'all'
      ? courses.find(c => c.code === selectedCourseCode)
      : undefined;

    createAnnouncement({
      courseId: courseObj?.id,
      courseCode: courseObj?.code,
      courseName: courseObj?.name,
      title,
      content,
      author: activeLecturer.name,
      authorRole: activeLecturer.title,
      authorAvatar: activeLecturer.avatar,
      priority,
      attachment: attachmentName.trim() ? { name: attachmentName.trim(), size: '850 KB' } : undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setContent('');
      setAttachmentName('');
      onClose();
    }, 1100);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/20 rounded-3xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-brand-orange text-white border-b-3 border-black p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Megaphone size={22} />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-black text-white rounded">
                  Faculty Broadcast
                </span>
                <h2 className="text-xl font-black font-display tracking-tight leading-tight">
                  Post Class Announcement
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white text-black hover:bg-brand-pink hover:text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-brand-green text-black border-3 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] mb-3">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black font-display text-[var(--text-primary)]">
                Announcement Broadcasted!
              </h3>
              <p className="text-[var(--text-secondary)] font-medium mt-1">
                Visible to all targeted students across dashboards and courses.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-brand-red/10 border-2 border-brand-red text-brand-red px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Course & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Target Audience
                  </label>
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  >
                    <option value="all">All Enrolled Students (Global)</option>
                    {courses.map(course => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  >
                    <option value="urgent">🔴 Urgent (Exams / Deadlines)</option>
                    <option value="important">🟡 Important (Lectures / Labs)</option>
                    <option value="general">🔵 General (Events / Notices)</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term 1 Room Allocation & Formula Sheet Guidelines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your notice to students. Be clear on dates, venues, instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2 font-medium text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
              </div>

              {/* Optional Attachment */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Attachment Reference Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exam_Seating_Plan_Oct2024.pdf"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t-2 border-black dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-black dark:text-white border-2 border-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_#000]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <Megaphone size={16} />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
