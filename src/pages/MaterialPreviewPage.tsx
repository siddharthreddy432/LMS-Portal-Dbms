import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  FileText,
  Presentation,
  FileCode,
  Archive,
  Eye,
  Calendar,
  User,
  Tag,
  ShieldCheck,
  Share2,
  Printer,
  Sparkles,
  BookOpen,
  ChevronRight,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  FolderOpen
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { LMSFileType, LMSResource } from '../types/lms';

export default function MaterialPreviewPage() {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const resourceId = id || queryId;

  const navigate = useNavigate();
  const { resources, courses, downloadResource } = useLMS();

  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content');

  // Find the requested resource
  const resource: LMSResource | undefined = useMemo(() => {
    if (!resourceId) return resources[0];
    return resources.find(r => r.id === resourceId) || resources[0];
  }, [resourceId, resources]);

  // Find related course
  const course = useMemo(() => {
    if (!resource) return undefined;
    return courses.find(c => c.code === resource.courseCode || c.id === resource.courseId);
  }, [resource, courses]);

  // Related materials in the same course
  const relatedResources = useMemo(() => {
    if (!resource) return [];
    return resources.filter(r => r.courseCode === resource.courseCode && r.id !== resource.id).slice(0, 4);
  }, [resource, resources]);

  const handleCopy = () => {
    if (resource?.previewContent) {
      navigator.clipboard.writeText(resource.previewContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getFileIcon = (type: LMSFileType) => {
    switch (type) {
      case 'ppt':
        return <Presentation className="text-brand-orange" size={28} />;
      case 'code':
        return <FileCode className="text-brand-blue" size={28} />;
      case 'zip':
        return <Archive className="text-brand-purple" size={28} />;
      default:
        return <FileText className="text-brand-pink" size={28} />;
    }
  };

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
          Material Not Found
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          The requested course document could not be located or has been archived.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-black border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000]"
        >
          <ArrowLeft size={14} />
          <span>Return to Courses</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Action & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <span className="text-gray-400">•</span>

          <Link
            to="/courses"
            className="text-xs font-bold text-gray-500 hover:text-[var(--text-primary)] hover:underline flex items-center gap-1"
          >
            <FolderOpen size={13} />
            <span>Course Materials</span>
          </Link>

          <span className="text-gray-400">/</span>

          <span className="text-xs font-black px-2 py-0.5 bg-black text-white rounded font-mono">
            {resource.courseCode}
          </span>

          <span className="text-gray-400">/</span>

          <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">
            {resource.title}
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          {resource.previewContent && (
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 text-[var(--text-primary)]"
            >
              {copied ? <Check size={14} className="text-brand-green" /> : <Copy size={14} />}
              <span>{copied ? 'Copied Content!' : 'Copy Text'}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/20 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 text-[var(--text-primary)]"
            title="Print Document"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={() => downloadResource(resource)}
            className="px-4 py-1.5 bg-brand-green text-white border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Download size={14} />
            <span>Download ({resource.fileSize})</span>
          </button>
        </div>
      </div>

      {/* Main Header Presentation Card */}
      <div className="bg-brand-blue/15 border-3 border-black dark:border-white/20 rounded-3xl p-5 sm:p-7 shadow-[5px_5px_0px_0px_#000] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 bg-white dark:bg-[#15181D] border-3 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000] shrink-0">
              {getFileIcon(resource.fileType)}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded-md font-mono">
                  {resource.courseCode}
                </span>
                <span className="px-2.5 py-0.5 bg-brand-yellow text-black border border-black rounded-md text-xs font-black shadow-[1px_1px_0px_0px_#000]">
                  {resource.unit}
                </span>
                <span className="px-2.5 py-0.5 bg-brand-pink/20 text-brand-pink border border-brand-pink/30 rounded-md text-xs font-bold">
                  {resource.category}
                </span>
                <span className="px-2 py-0.5 bg-brand-green/20 text-brand-green border border-brand-green/30 rounded-md text-[11px] font-black uppercase flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Verified Faculty Resource</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-[var(--text-primary)] leading-tight tracking-tight">
                {resource.title}
              </h1>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-3xl leading-relaxed">
                {resource.description || 'Comprehensive learning notes, practical exercises, and syllabus study references prepared for students.'}
              </p>

              {/* Attribution and Meta Bar */}
              <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-[var(--text-secondary)] font-bold">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-brand-pink" />
                  <span>Uploaded by: <strong className="text-[var(--text-primary)]">{resource.uploadedBy}</strong></span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-brand-blue" />
                  <span>Date: {resource.uploadedAt}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Download size={14} className="text-brand-green" />
                  <span>{resource.downloadCount} Downloads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Reader & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Document Reader Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            {/* Viewer Control Header */}
            <div className="p-3.5 sm:p-4 bg-gray-50 dark:bg-white/5 border-b-2 border-black dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                  Document Preview Canvas
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">
                  {resource.fileType.toUpperCase()}
                </span>
              </div>

              {/* Text Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#15181D] border-2 border-black/20 dark:border-white/20 rounded-xl px-2 py-1">
                <span className="text-[11px] font-bold text-gray-500 mr-1 hidden sm:inline">Text Size:</span>
                <button
                  type="button"
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-0.5 rounded text-xs font-black transition-colors ${fontSize === 'sm' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500'}`}
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('base')}
                  className={`px-2 py-0.5 rounded text-xs font-black transition-colors ${fontSize === 'base' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500'}`}
                >
                  M
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-0.5 rounded text-xs font-black transition-colors ${fontSize === 'lg' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500'}`}
                >
                  L
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="p-5 sm:p-7 min-h-[480px] bg-white dark:bg-[#14171C]">
              {resource.previewContent ? (
                <div
                  className={`leading-relaxed whitespace-pre-wrap ${
                    resource.fileType === 'code'
                      ? 'font-mono text-xs sm:text-sm bg-gray-900 text-gray-100 p-5 rounded-xl overflow-x-auto shadow-inner border-2 border-black'
                      : fontSize === 'sm'
                      ? 'text-xs text-[var(--text-primary)]'
                      : fontSize === 'lg'
                      ? 'text-base sm:text-lg text-[var(--text-primary)]'
                      : 'text-sm sm:text-base text-[var(--text-primary)]'
                  }`}
                >
                  {resource.previewContent}
                </div>
              ) : (
                <div className="p-12 text-center space-y-3">
                  <FileText size={48} className="mx-auto text-gray-400" />
                  <h3 className="text-base font-black text-[var(--text-primary)]">
                    Direct Document Preview
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    This file is ready for download. Click download below to open with your local application.
                  </p>
                  <button
                    onClick={() => downloadResource(resource)}
                    className="px-5 py-2.5 bg-brand-green text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_#000]"
                  >
                    Download {resource.fileName}
                  </button>
                </div>
              )}
            </div>

            {/* Document Footer Bar */}
            <div className="p-3.5 bg-gray-50 dark:bg-white/5 border-t-2 border-black dark:border-white/10 flex items-center justify-between text-xs font-bold text-gray-500">
              <span>File: {resource.fileName}</span>
              <span>Size: {resource.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Related Notes (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <h3 className="font-black font-display text-base text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles size={18} className="text-brand-yellow" />
              <span>Syllabus & Material Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10">
                <span className="font-bold text-gray-500 block mb-0.5">Subject Course</span>
                <span className="font-black text-sm text-[var(--text-primary)]">
                  {resource.courseCode} - {course?.name || 'Computer Science Engineering'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10">
                <span className="font-bold text-gray-500 block mb-0.5">Syllabus Module</span>
                <span className="font-black text-sm text-brand-purple">
                  {resource.unit}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-[#15181D] rounded-xl border border-black/10 dark:border-white/10">
                <span className="font-bold text-gray-500 block mb-0.5">Category</span>
                <span className="font-black text-sm text-[var(--text-primary)]">
                  {resource.category}
                </span>
              </div>
            </div>

            {/* Tags Cloud */}
            {resource.tags && resource.tags.length > 0 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                  Topic Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-[var(--text-primary)] rounded-lg text-xs font-bold border border-black/15 dark:border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Handouts in Same Course */}
          {relatedResources.length > 0 && (
            <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
              <h3 className="font-black font-display text-sm text-[var(--text-primary)] flex items-center gap-2">
                <BookOpen size={16} className="text-brand-pink" />
                <span>More from {resource.courseCode}</span>
              </h3>

              <div className="space-y-2">
                {relatedResources.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/preview/${rel.id}`}
                    className="p-3 bg-gray-50 dark:bg-[#15181D] border-2 border-black/10 dark:border-white/10 rounded-xl block hover:border-black dark:hover:border-white/30 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-brand-pink">
                        {rel.unit}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {rel.fileSize}
                      </span>
                    </div>
                    <p className="font-black text-xs text-[var(--text-primary)] group-hover:text-brand-blue truncate mt-1">
                      {rel.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
