import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText, Presentation, FileCode, Archive, ExternalLink, Copy, Check, Eye, User, Calendar, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { LMSResource, LMSFileType } from '../../types/lms';
import { useLMS } from '../../context/LMSContext';

interface FilePreviewModalProps {
  resource: LMSResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilePreviewModal({ resource, isOpen, onClose }: FilePreviewModalProps) {
  const { downloadResource } = useLMS();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata'>('preview');

  if (!isOpen || !resource) return null;

  const handleCopyContent = () => {
    if (resource.previewContent) {
      navigator.clipboard.writeText(resource.previewContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFileIcon = (type: LMSFileType) => {
    switch (type) {
      case 'ppt':
        return <Presentation className="text-brand-orange" size={24} />;
      case 'code':
        return <FileCode className="text-brand-blue" size={24} />;
      case 'zip':
        return <Archive className="text-brand-purple" size={24} />;
      default:
        return <FileText className="text-brand-pink" size={24} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/20 rounded-3xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden my-6 flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="bg-brand-blue/15 border-b-3 border-black dark:border-white/20 p-4 sm:p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 bg-white dark:bg-[#15181D] border-2 border-black rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
                {getFileIcon(resource.fileType)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-black px-2 py-0.5 bg-black text-white rounded">
                    {resource.courseCode}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-brand-yellow text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                    {resource.unit}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-brand-pink/20 text-brand-pink border border-brand-pink/40 rounded">
                    {resource.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black font-display text-[var(--text-primary)] leading-snug truncate">
                  {resource.title}
                </h2>
                <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                  <span>{resource.fileName}</span>
                  <span>•</span>
                  <span>{resource.fileSize}</span>
                  <span>•</span>
                  <span className="text-brand-pink">Uploaded by {resource.uploadedBy}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 bg-white dark:bg-[#15181D] hover:bg-brand-pink hover:text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub Navigation Bar */}
          <div className="px-5 py-2.5 bg-gray-50 dark:bg-white/5 border-b-2 border-black dark:border-white/10 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg font-bold border-2 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Eye size={14} /> File Preview
                </span>
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-3 py-1 rounded-lg font-bold border-2 transition-all ${
                  activeTab === 'metadata'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white dark:bg-[#15181D] text-[var(--text-primary)] border-transparent hover:border-black'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} /> Details & Tags
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {resource.previewContent && (
                <button
                  onClick={handleCopyContent}
                  className="px-2.5 py-1 bg-white dark:bg-[#15181D] border-2 border-black rounded-lg font-bold flex items-center gap-1 text-[var(--text-primary)] shadow-[1px_1px_0px_0px_#000] hover:bg-brand-yellow transition-colors"
                  title="Copy text snippet"
                >
                  {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Body */}
          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            {activeTab === 'preview' ? (
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#0F1115] border-2 border-black dark:border-white/20 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#000]">
                  <div className="flex items-center justify-between border-b-2 border-dashed border-gray-300 dark:border-gray-700 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-pink border border-black inline-block" />
                      <span className="w-3 h-3 rounded-full bg-brand-yellow border border-black inline-block" />
                      <span className="w-3 h-3 rounded-full bg-brand-green border border-black inline-block" />
                      <span className="text-xs font-mono font-bold text-gray-500 ml-2">
                        {resource.fileName}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {resource.fileType} Document Viewer
                    </span>
                  </div>

                  <pre className="font-mono text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed select-text bg-gray-50 dark:bg-black/40 p-4 rounded-xl border border-black/10 dark:border-white/10 max-h-[46vh] overflow-y-auto">
                    {resource.previewContent || `[Course Document Preview]\n\nTitle: ${resource.title}\nCourse: ${resource.courseName} (${resource.courseCode})\nUnit: ${resource.unit}\nFaculty: ${resource.uploadedBy}\n\nDescription:\n${resource.description}\n\nClick "Download File" below to download the entire package.`}
                  </pre>
                </div>

                {resource.description && (
                  <div className="bg-brand-yellow/15 border-2 border-black rounded-2xl p-4">
                    <h4 className="font-black text-xs uppercase tracking-wider mb-1 text-black dark:text-white">
                      Faculty Remarks / Scope:
                    </h4>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {resource.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-white/5 border-2 border-black rounded-2xl p-4">
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Course</p>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">{resource.courseName}</p>
                    <p className="text-xs font-bold text-brand-pink mt-0.5">{resource.courseCode}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border-2 border-black rounded-2xl p-4">
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Instructor</p>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">{resource.uploadedBy}</p>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">{resource.lecturerRole || 'Faculty Member'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border-2 border-black rounded-2xl p-4">
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Module / Unit</p>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">{resource.unit}</p>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">{resource.category}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 border-2 border-black rounded-2xl p-4">
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">Upload Details</p>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">{resource.uploadedAt}</p>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">{resource.downloadCount} student downloads</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 border-2 border-black rounded-2xl p-4">
                  <p className="text-xs font-black uppercase text-gray-500 mb-2">Subject Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-white dark:bg-[#15181D] border-2 border-black rounded-lg text-xs font-black shadow-[1px_1px_0px_0px_#000]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 bg-gray-100 dark:bg-[#15181D] border-t-3 border-black dark:border-white/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
              <ShieldCheck size={16} className="text-brand-green" />
              <span>Verified KLU Academic Material</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white dark:bg-white/10 text-black dark:text-white border-2 border-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_#000] hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => downloadResource(resource)}
                className="px-5 py-2 bg-brand-green text-black border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Download size={17} />
                <span>Download File ({resource.fileSize})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
