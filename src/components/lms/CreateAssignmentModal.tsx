import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlusCircle, CheckCircle2, FileText, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseCode?: string;
}

export default function CreateAssignmentModal({ isOpen, onClose, defaultCourseCode }: CreateAssignmentModalProps) {
  const { courses, activeLecturer, createAssignment } = useLMS();

  const [selectedCourseCode, setSelectedCourseCode] = useState(defaultCourseCode || courses[0]?.code || '25SC1204E');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(20);
  const [unit, setUnit] = useState('Unit 3');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }
    if (!dueDate) {
      setError('Please choose a due date.');
      return;
    }

    const courseObj = courses.find(c => c.code === selectedCourseCode) || courses[0];

    const attachments = attachmentName.trim()
      ? [{ name: attachmentName.trim(), size: '450 KB', type: 'pdf' as const }]
      : [];

    createAssignment({
      courseId: courseObj.id,
      courseCode: courseObj.code,
      courseName: courseObj.name,
      title,
      description,
      dueDate,
      maxMarks: Number(maxMarks),
      unit,
      createdBy: activeLecturer.name,
      status: 'active',
      attachments
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1100);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setMaxMarks(20);
    setAttachmentName('');
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/20 rounded-3xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-brand-purple text-white border-b-3 border-black p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <PlusCircle size={22} />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-black text-white rounded">
                  Faculty LMS Portal
                </span>
                <h2 className="text-xl font-black font-display tracking-tight leading-tight">
                  Publish New Assignment
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
                Assignment Published!
              </h3>
              <p className="text-[var(--text-secondary)] font-medium mt-1">
                Enrolled students can now submit their solutions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="bg-brand-red/10 border-2 border-brand-red text-brand-red px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Course & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Target Course *
                  </label>
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    {courses.map(course => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Module / Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    <option value="Unit 1">Unit 1</option>
                    <option value="Unit 2">Unit 2</option>
                    <option value="Unit 3">Unit 3</option>
                    <option value="Unit 4">Unit 4</option>
                    <option value="Unit 5">Unit 5</option>
                    <option value="Lab Work">Lab Work</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Assignment 4: Graph Traversals & Minimum Spanning Trees"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  required
                />
              </div>

              {/* Due Date & Max Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Due Date & Time *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oct 18, 2024 11:59 PM"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Instructions & Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail problem statements, grading criteria, acceptable file extensions (zip, pdf), and deadlines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2 font-medium text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  required
                />
              </div>

              {/* Optional Attachment */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Reference / Problem Sheet File Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Assignment4_Problem_Statement_Cases.pdf"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
                  className="px-5 py-2 bg-brand-purple text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <PlusCircle size={16} />
                  <span>Publish Assignment</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
