import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle2, FileText, Download, User, MessageSquare } from 'lucide-react';
import { LMSAssignment, LMSSubmission } from '../../types/lms';
import { useLMS } from '../../context/LMSContext';

interface GradeSubmissionModalProps {
  assignment: LMSAssignment | null;
  submission: LMSSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GradeSubmissionModal({ assignment, submission, isOpen, onClose }: GradeSubmissionModalProps) {
  const { gradeSubmission } = useLMS();

  const [grade, setGrade] = useState<number>(submission?.grade ?? (assignment?.maxMarks ? Math.round(assignment.maxMarks * 0.85) : 18));
  const [feedback, setFeedback] = useState<string>(submission?.feedback || 'Good work! Code is well-structured and edge cases are handled.');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !assignment || !submission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gradeSubmission(assignment.id, submission.id, Number(grade), feedback);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  const handleDownloadStudentFile = () => {
    if (submission.fileData && submission.fileData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = submission.fileData;
      a.download = submission.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob([`// KL University Student Submission\n// Student: ${submission.studentName} (${submission.studentId})\n// Course: ${assignment.courseCode}\n// Assignment: ${assignment.title}\n// Submitted: ${submission.submittedAt}\n\n${submission.remarks || 'No remarks provided.'}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = submission.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
          <div className="bg-brand-green text-black border-b-3 border-black p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Award size={22} className="text-black" />
              </div>
              <div>
                <span className="text-xs uppercase font-black px-2 py-0.5 bg-black text-white rounded">
                  Faculty Grading Panel
                </span>
                <h2 className="text-xl font-black font-display tracking-tight">
                  Evaluate Submission
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white hover:bg-brand-pink hover:text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
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
                Grade & Feedback Recorded!
              </h3>
              <p className="text-[var(--text-secondary)] font-medium mt-1">
                Student gradebook has been updated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Student details card */}
              <div className="bg-gray-50 dark:bg-white/5 border-2 border-black rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-black text-sm flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    {submission.studentName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[var(--text-primary)]">
                      {submission.studentName}
                    </h3>
                    <p className="text-xs font-bold text-gray-500">
                      ID: {submission.studentId} • Submitted: {submission.submittedAt}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase border border-black ${
                  submission.status === 'graded' ? 'bg-brand-green text-black' : 'bg-brand-yellow text-black'
                }`}>
                  {submission.status}
                </span>
              </div>

              {/* Submitted File Row */}
              <div className="bg-white dark:bg-[#15181D] border-2 border-black rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate mr-2">
                  <FileText className="text-brand-pink flex-shrink-0" size={18} />
                  <span className="font-extrabold text-xs text-[var(--text-primary)] truncate">
                    {submission.fileName}
                  </span>
                  <span className="text-xs text-gray-400">({submission.fileSize || '140 KB'})</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStudentFile}
                  className="px-2.5 py-1 bg-brand-yellow text-black border-2 border-black rounded-lg text-xs font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 flex-shrink-0"
                >
                  <Download size={13} />
                  <span>Download File</span>
                </button>
              </div>

              {submission.remarks && (
                <div className="p-3 bg-brand-yellow/15 border-2 border-black/30 rounded-xl text-xs">
                  <span className="font-black text-gray-600 dark:text-gray-400 block mb-0.5">Student Notes:</span>
                  <p className="text-[var(--text-primary)] font-medium italic">"{submission.remarks}"</p>
                </div>
              )}

              {/* Marks input */}
              <div className="bg-brand-purple/10 border-2 border-brand-purple rounded-2xl p-4">
                <label className="block text-xs font-black uppercase tracking-wider mb-2 text-[var(--text-primary)]">
                  Award Score (Max: {assignment.maxMarks} marks) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={assignment.maxMarks}
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-24 bg-white dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-xl px-3 py-2 text-xl font-black text-center shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    required
                  />
                  <span className="text-lg font-black text-gray-400">/ {assignment.maxMarks}</span>
                  <span className="text-xs font-bold text-gray-500 ml-auto">
                    Percentage: {Math.round((grade / assignment.maxMarks) * 100)}%
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-[var(--text-primary)]">
                  Feedback & Instructor Critique
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for the student..."
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2 font-medium text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  required
                />
              </div>

              {/* Footer Actions */}
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
                  className="px-5 py-2 bg-brand-green text-black border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <Award size={16} />
                  <span>Save Evaluation</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
