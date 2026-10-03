import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Pin } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { LMSFileType } from '../../types/lms';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseCode?: string;
}

export default function UploadResourceModal({ isOpen, onClose, defaultCourseCode }: UploadResourceModalProps) {
  const { courses, activeLecturer, addResource } = useLMS();

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    defaultCourseCode || courses[0]?.code || '25SC1204E'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('Unit 1');
  const [category, setCategory] = useState<'Lecture Notes' | 'Slides / PPT' | 'Lab Manual' | 'Previous Papers' | 'Reference Material' | 'Assignment Guide'>('Lecture Notes');
  const [pinned, setPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [fileType, setFileType] = useState<LMSFileType>('pdf');
  const [previewContent, setPreviewContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const detectFileType = (fileName: string): LMSFileType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['ppt', 'pptx'].includes(ext || '')) return 'ppt';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['cpp', 'c', 'java', 'py', 'ts', 'js', 'html', 'css', 'sql'].includes(ext || '')) return 'code';
    if (['zip', 'rar', 'tar', 'gz'].includes(ext || '')) return 'zip';
    return 'pdf';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setFileSizeStr(formatFileSize(selectedFile.size));
    const detected = detectFileType(selectedFile.name);
    setFileType(detected);

    if (!title) {
      // Auto-populate clean title from filename
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Read as DataURL for real storage & download capability
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileDataUrl(result);
    };
    reader.readAsDataURL(selectedFile);

    // If text/code or small file, also read text preview
    if (selectedFile.size < 500000 && (selectedFile.type.includes('text') || detected === 'code')) {
      const textReader = new FileReader();
      textReader.onload = (event) => {
        setPreviewContent(event.target?.result as string || '');
      };
      textReader.readAsText(selectedFile);
    } else {
      setPreviewContent(`File: ${selectedFile.name}\nSize: ${formatFileSize(selectedFile.size)}\nType: ${detected.toUpperCase()}\n\nUploaded for course: ${selectedCourseCode}\nInstructor: ${activeLecturer.name}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the resource.');
      return;
    }

    const courseObj = courses.find(c => c.code === selectedCourseCode) || courses[0];
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (tags.length === 0) {
      tags.push(unit, category);
    }

    const fileName = file ? file.name : `${title.replace(/\s+/g, '_')}.${fileType === 'code' ? 'cpp' : fileType === 'ppt' ? 'pptx' : 'pdf'}`;
    const generatedPreview = previewContent || `${courseObj.code} - ${courseObj.name}\n${title}\nUnit: ${unit} | Category: ${category}\nUploaded by: ${activeLecturer.name}\n\n${description || 'Course learning document and reference guide for students.'}`;

    addResource({
      courseId: courseObj.id,
      courseCode: courseObj.code,
      courseName: courseObj.name,
      title,
      description: description.trim() || `Course resource for ${courseObj.name} (${unit})`,
      unit,
      category,
      fileType,
      fileName,
      fileSize: fileSizeStr || '1.8 MB',
      fileUrl: fileDataUrl || undefined,
      previewContent: generatedPreview,
      uploadedBy: activeLecturer.name,
      lecturerRole: activeLecturer.title,
      pinned,
      tags
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1200);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setFileDataUrl('');
    setFileSizeStr('');
    setTagsInput('');
    setPinned(false);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/20 rounded-3xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-brand-yellow border-b-3 border-black p-5 flex items-center justify-between text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <UploadCloud className="text-black" size={22} />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider bg-black text-white px-2 py-0.5 rounded">
                  Faculty LMS Portal
                </span>
                <h2 className="text-xl font-black font-display tracking-tight leading-tight">
                  Upload Course Material & Files
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
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-brand-green text-black border-3 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black font-display text-[var(--text-primary)]">
                File Successfully Uploaded!
              </h3>
              <p className="text-[var(--text-secondary)] font-medium mt-1">
                Now visible to all enrolled students and faculty members.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="bg-brand-red/10 border-2 border-brand-red text-brand-red px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Course Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Target Course *
                  </label>
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
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
                    Unit / Module *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  >
                    <option value="Unit 1">Unit 1: Fundamentals</option>
                    <option value="Unit 2">Unit 2: Core Concepts</option>
                    <option value="Unit 3">Unit 3: Intermediate Topics</option>
                    <option value="Unit 4">Unit 4: Advanced Systems</option>
                    <option value="Unit 5">Unit 5: Applications & Special Topics</option>
                    <option value="Lab Manual">Lab Manual & Experiments</option>
                    <option value="General">General / Syllabus / Blueprint</option>
                  </select>
                </div>
              </div>

              {/* Category & File Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  >
                    <option value="Lecture Notes">Lecture Notes / Handouts</option>
                    <option value="Slides / PPT">Slides / Presentation</option>
                    <option value="Lab Manual">Lab Manual / Code Templates</option>
                    <option value="Previous Papers">Previous Question Papers & Solutions</option>
                    <option value="Reference Material">Reference Material / Cheatsheet</option>
                    <option value="Assignment Guide">Assignment Guidelines & Rubrics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    File Type
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as LMSFileType)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="ppt">Presentation (.pptx / .ppt)</option>
                    <option value="doc">Word Document (.docx)</option>
                    <option value="code">Source Code / Archive (.zip, .cpp, .py)</option>
                    <option value="link">Online Reference / Web Link</option>
                  </select>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Resource Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3: Complete AVL & Red-Black Trees Handbook"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  required
                />
              </div>

              {/* Drag and Drop File Area */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Select File from Device (PDF, DOCX, PPTX, ZIP, Code)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-3 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-brand-pink bg-brand-pink/10 scale-[1.01]'
                      : file
                      ? 'border-brand-green bg-brand-green/10'
                      : 'border-black dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.cpp,.java,.py,.ts,.js,.txt,.sql"
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-brand-green text-black border-2 border-black rounded-xl flex items-center justify-center font-bold">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold text-sm text-[var(--text-primary)] truncate max-w-xs sm:max-w-md">
                          {file.name}
                        </p>
                        <p className="text-xs font-bold text-gray-500">
                          {fileSizeStr} • Click or drag to change
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="w-12 h-12 bg-brand-blue text-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000] mb-2 transform -rotate-3">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-sm font-extrabold text-[var(--text-primary)]">
                        Click to browse or drop your course file here
                      </p>
                      <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
                        Supports PDF, PPT, Word, ZIP, Code up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Description / Topic Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key concepts, syllabus coverage, or instructions for students..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2 font-medium text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              {/* Tags & Pin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AVL, Rotations, Mid-1 Prep"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3 py-2 font-bold text-xs text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  />
                </div>

                <div className="pt-4 sm:pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-extrabold text-xs text-[var(--text-primary)] select-none">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-black text-brand-pink focus:ring-brand-pink"
                    />
                    <Pin size={14} className={pinned ? 'text-brand-pink fill-brand-pink' : ''} />
                    <span>Pin to Top of Materials</span>
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t-2 border-black dark:border-white/10 flex items-center justify-between gap-3">
                <div className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-brand-yellow" />
                  <span>Posting as: <strong className="text-[var(--text-primary)]">{activeLecturer.name}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-black dark:text-white border-2 border-black rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors shadow-[2px_2px_0px_0px_#000]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-pink text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <UploadCloud size={16} />
                    <span>Publish Material</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
