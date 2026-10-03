import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, CheckCircle2, FileText, AlertCircle, Send, Clock, Award } from 'lucide-react';
import { LMSAssignment } from '../../types/lms';
import { useLMS } from '../../context/LMSContext';

interface AssignmentSubmitModalProps {
  assignment: LMSAssignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignmentSubmitModal({ assignment, isOpen, onClose }: AssignmentSubmitModalProps) {
  const { submitAssignment } = useLMS();

  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !assignment) return null;

  const existingSubmission = assignment.submissions.find(s => s.studentId === '2300030114');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setFileSizeStr(formatFileSize(selectedFile.size));
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !existingSubmission) {
      setError('Please attach your solution file before submitting.');
      return;
    }

    const fileName = file ? file.name : (existingSubmission?.fileName || 'Solution.zip');
    submitAssignment(assignment.id, {
      fileName,
      fileData: fileDataUrl || existingSubmission?.fileData,
      fileSize: fileSizeStr || existingSubmission?.fileSize || '150 KB',
      remarks
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/20 rounded-3xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-brand-pink text-white border-b-3 border-black p-5 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-black text-white rounded">
                Student Assignment Portal
              </span>
              <h2 className="text-xl font-black font-display tracking-tight mt-1">
                {existingSubmission ? 'Update Assignment Submission' : 'Submit Assignment'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white text-black hover:bg-brand-yellow border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
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
                Assignment Submitted!
              </h3>
              <p className="text-[var(--text-secondary)] font-medium mt-1">
                Your professor has been notified. You can review your submission anytime.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Assignment Meta Header */}
              <div className="bg-brand-yellow/20 border-2 border-black rounded-2xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                  <span className="text-xs font-black px-2 py-0.5 bg-black text-white rounded">
                    {assignment.courseCode}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-pink">
                    <Clock size={13} />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[var(--text-primary)]">
                  {assignment.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                  {assignment.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600 dark:text-gray-400">Created by {assignment.createdBy}</span>
                  <span className="bg-brand-green/20 text-green-800 dark:text-green-300 px-2 py-0.5 rounded border border-green-400">
                    Max Marks: {assignment.maxMarks}
                  </span>
                </div>
              </div>

              {/* Status if already submitted or graded */}
              {existingSubmission && (
                <div className="bg-brand-blue/15 border-2 border-brand-blue rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-brand-blue">
                      Current Submission: {existingSubmission.status === 'graded' ? 'Graded' : 'Submitted'}
                    </span>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {existingSubmission.fileName} ({existingSubmission.fileSize})
                    </p>
                  </div>
                  {existingSubmission.grade !== undefined && (
                    <div className="bg-brand-green text-black border-2 border-black px-3 py-1 rounded-xl text-center shadow-[2px_2px_0px_0px_#000]">
                      <span className="text-xs font-bold block">Score</span>
                      <span className="text-base font-black">{existingSubmission.grade} / {existingSubmission.maxMarks || assignment.maxMarks}</span>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-brand-red/10 border-2 border-brand-red text-brand-red px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* File Upload Area */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-[var(--text-primary)]">
                  Upload Solution File (Source Code, PDF, ZIP)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-3 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-brand-pink bg-brand-pink/10'
                      : file
                      ? 'border-brand-green bg-brand-green/10'
                      : 'border-black dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:bg-gray-100'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".zip,.rar,.tar,.gz,.pdf,.cpp,.java,.py,.ts,.js,.html,.css"
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-brand-green text-black border-2 border-black rounded-xl flex items-center justify-center font-bold">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold text-sm text-[var(--text-primary)] truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs font-bold text-gray-500">
                          {fileSizeStr} • Ready to submit
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="w-10 h-10 bg-brand-pink text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] mb-2 transform -rotate-3">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-sm font-extrabold text-[var(--text-primary)]">
                        Click to select your assignment file
                      </p>
                      <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
                        ZIP archives, C++, Java, Python, or PDF documents
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Remarks */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-[var(--text-primary)]">
                  Comments / Implementation Notes for Faculty
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Completed all unit tests. Mention any assumptions or dependencies..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2 font-medium text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              {/* Actions */}
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
                  className="px-5 py-2 bg-brand-pink text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Send size={16} />
                  <span>{existingSubmission ? 'Re-Submit Solution' : 'Submit Assignment'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
