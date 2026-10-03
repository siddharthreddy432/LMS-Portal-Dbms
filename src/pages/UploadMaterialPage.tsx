import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Pin,
  ArrowLeft,
  Eye,
  FileCode,
  Presentation,
  Archive,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLMS } from '../context/LMSContext';
import { LMSFileType } from '../types/lms';

export default function UploadMaterialPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get('course');

  const { courses, activeLecturer, addResource, resources } = useLMS();

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    courseParam || courses[0]?.code || '25SC1204E'
  );

  useEffect(() => {
    if (courseParam && courses.some(c => c.code === courseParam)) {
      setSelectedCourseCode(courseParam);
    }
  }, [courseParam, courses]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('Unit 1');
  const [category, setCategory] = useState<'Lecture Notes' | 'Slides / PPT' | 'Lab Manual' | 'Previous Papers' | 'Reference Material' | 'Assignment Guide'>('Lecture Notes');
  const [pinned, setPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [fileType, setFileType] = useState<LMSFileType>('pdf');
  const [previewContent, setPreviewContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedId, setUploadedId] = useState<string | null>(null);

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

  const processSelectedFile = (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setFileSizeStr(formatFileSize(selectedFile.size));
    const detected = detectFileType(selectedFile.name);
    setFileType(detected);

    if (!title) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileDataUrl(event.target?.result as string || '');
    };
    reader.readAsDataURL(selectedFile);

    if (selectedFile.size < 500000 && (selectedFile.type.includes('text') || detected === 'code')) {
      const textReader = new FileReader();
      textReader.onload = (event) => {
        setPreviewContent(event.target?.result as string || '');
      };
      textReader.readAsText(selectedFile);
    } else {
      setPreviewContent(`File: ${selectedFile.name}\nSize: ${formatFileSize(selectedFile.size)}\nType: ${detected.toUpperCase()}\nCourse: ${selectedCourseCode}\nUploader: ${activeLecturer.name}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
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
      setError('Please enter a title for this course material.');
      return;
    }

    const courseObj = courses.find(c => c.code === selectedCourseCode) || courses[0];
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (tags.length === 0) {
      tags.push(unit, category);
    }

    const fileName = file ? file.name : `${title.replace(/\s+/g, '_')}.${fileType === 'code' ? 'cpp' : fileType === 'ppt' ? 'pptx' : 'pdf'}`;
    const generatedPreview = previewContent || `${courseObj.code} - ${courseObj.name}\n${title}\nUnit: ${unit} | Category: ${category}\nUploaded by: ${activeLecturer.name}\n\n${description || 'Course learning document and reference guide for students.'}`;

    const newRes = addResource({
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

    setUploadedId(newRes.id);
    setIsSuccess(true);
  };

  const selectedCourse = courses.find(c => c.code === selectedCourseCode) || courses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Navigation Breadcrumb & Back button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white dark:bg-[#1B1F26] border-2 border-black rounded-xl font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 dark:hover:bg-white/5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 text-[var(--text-primary)]"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to="/courses"
            className="px-3.5 py-1.5 bg-brand-yellow text-black border-2 border-black rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-400 transition-colors"
          >
            My Courses
          </Link>
          <Link
            to="/lecturers"
            className="px-3.5 py-1.5 bg-brand-pink text-white border-2 border-black rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-pink-600 transition-colors"
          >
            Faculty Portal
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pink text-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider rounded-lg">
                Course Materials Hub
              </span>
              <span className="px-2.5 py-0.5 bg-brand-yellow text-black border border-black rounded-md text-xs font-black shadow-[1px_1px_0px_0px_#000]">
                Shared Repository
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Upload Course File & Learning Materials
            </h1>
            <p className="text-white/90 font-medium text-sm sm:text-base mt-1 max-w-2xl">
              Add lecture notes, presentation decks, lab assignments, or question banks. Once submitted, your files will be viewable and downloadable by both lecturers and students.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 text-xs font-bold space-y-1.5 self-start md:self-auto">
            <span className="text-brand-yellow block font-black uppercase">Publishing Identity:</span>
            <p className="font-extrabold text-sm">{activeLecturer.name}</p>
            <p className="text-white/80">{activeLecturer.title}</p>
          </div>
        </div>
      </motion.div>

      {/* Success Celebration View */}
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_#000] max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-brand-green text-black border-3 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] mx-auto mb-4 transform -rotate-3">
            <CheckCircle2 size={44} />
          </div>

          <span className="px-3 py-1 bg-black text-white text-xs font-black uppercase rounded-lg">
            Upload Confirmed
          </span>

          <h2 className="text-3xl font-black font-display text-[var(--text-primary)] mt-3">
            Material Successfully Uploaded!
          </h2>
          <p className="text-[var(--text-secondary)] font-medium text-sm sm:text-base mt-2 max-w-md mx-auto">
            Your file <strong className="text-brand-pink font-extrabold">{title}</strong> has been indexed for <strong className="text-[var(--text-primary)]">{selectedCourse.code} ({selectedCourse.name})</strong> and is now viewable by all lecturers and students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-brand-yellow text-black border-2 border-black rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <BookOpen size={18} />
              <span>View in My Courses</span>
            </button>

            <button
              onClick={() => navigate('/lecturers')}
              className="px-6 py-3 bg-brand-blue text-white border-2 border-black rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:bg-cyan-600 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <GraduationCap size={18} />
              <span>Go to Lecturer Portal</span>
            </button>

            <button
              onClick={() => {
                setIsSuccess(false);
                setTitle('');
                setDescription('');
                setFile(null);
                setFileDataUrl('');
                setFileSizeStr('');
                setTagsInput('');
                setPinned(false);
              }}
              className="px-6 py-3 bg-white dark:bg-white/10 text-black dark:text-white border-2 border-black rounded-2xl font-bold text-sm shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100 transition-colors"
            >
              + Upload Another File
            </button>
          </div>
        </motion.div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metadata Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#000] space-y-5">
              <div className="border-b-2 border-black/10 dark:border-white/10 pb-3">
                <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                  Resource Information
                </h3>
                <p className="text-xs font-bold text-[var(--text-secondary)]">
                  Specify course, curriculum unit, and document metadata
                </p>
              </div>

              {error && (
                <div className="bg-brand-red/10 border-2 border-brand-red text-brand-red px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Course Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Target Course *
                </label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-4 py-3 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                >
                  {courses.map(course => (
                    <option key={course.code} value={course.code}>
                      {course.code} - {course.name} ({course.department})
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-gray-500">
                  <span>Instructor: {selectedCourse.instructor.name}</span>
                  <span>•</span>
                  <span>{selectedCourse.credits} Credits</span>
                </div>
              </div>

              {/* Unit & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                    Curriculum Unit / Module *
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
                    <option value="Unit 5">Unit 5: Special Topics</option>
                    <option value="Lab Manual">Lab Manual & Starter Code</option>
                    <option value="General">General / Blueprint / Syllabus</option>
                  </select>
                </div>

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
                    <option value="Slides / PPT">Slides / Presentation Deck</option>
                    <option value="Lab Manual">Lab Manual / Code Templates</option>
                    <option value="Previous Papers">Previous Question Papers & Solutions</option>
                    <option value="Reference Material">Reference Material / Cheatsheet</option>
                    <option value="Assignment Guide">Assignment Guide & Rubrics</option>
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
                  placeholder="e.g. Unit 3: Complete AVL & Red-Black Trees Handbook with Rotations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-4 py-2.5 font-bold text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-[var(--text-primary)]">
                  Detailed Description & Learning Objectives
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize key topics covered, prerequisites, or exam tips for students..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-4 py-2.5 font-medium text-sm text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
              </div>

              {/* Tags & Pin Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1 text-[var(--text-primary)]">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AVL, Rotations, Mid-1"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3 py-2 font-bold text-xs text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  />
                </div>

                <div className="pt-2 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-extrabold text-xs text-[var(--text-primary)] select-none">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-black text-brand-pink focus:ring-brand-pink"
                    />
                    <Pin size={15} className={pinned ? 'text-brand-pink fill-brand-pink' : ''} />
                    <span>Pin to Top of Materials Repository</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: File Upload Area & Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1B1F26] border-3 border-black dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#000] space-y-5">
              <div className="border-b-2 border-black/10 dark:border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                    File Attachment
                  </h3>
                  <p className="text-xs font-bold text-[var(--text-secondary)]">
                    Drag and drop or select your document
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-yellow text-black border-2 border-black flex items-center justify-center font-black">
                  <UploadCloud size={16} />
                </div>
              </div>

              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-3xl p-7 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-brand-pink bg-brand-pink/10 scale-[1.02]'
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
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 bg-brand-green text-black border-2 border-black rounded-2xl flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_#000]">
                      <FileText size={28} />
                    </div>
                    <div>
                      <p className="font-black text-sm text-[var(--text-primary)] break-all max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs font-bold text-gray-500 mt-0.5">
                        {fileSizeStr} • Type: {fileType.toUpperCase()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-pink underline mt-2">
                      Click or drag another file to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-16 h-16 bg-brand-yellow text-black border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000] mb-3 transform -rotate-3">
                      <UploadCloud size={30} />
                    </div>
                    <p className="text-base font-extrabold text-[var(--text-primary)]">
                      Drop course file here, or browse
                    </p>
                    <p className="text-xs font-bold text-[var(--text-secondary)] mt-1">
                      PDF, PPTX, Word, ZIP archives, C++, Java, Python
                    </p>
                    <span className="mt-3 px-3 py-1 bg-black text-white text-xs font-black rounded-lg">
                      Up to 50MB
                    </span>
                  </div>
                )}
              </div>

              {/* Format selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-[var(--text-primary)]">
                  Format Classification
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as LMSFileType)}
                  className="w-full bg-[var(--bg-input)] border-2 border-black dark:border-white/20 rounded-xl px-3.5 py-2 font-bold text-xs text-[var(--text-primary)] shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                >
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="ppt">PowerPoint Presentation (.pptx / .ppt)</option>
                  <option value="doc">Word Document (.docx)</option>
                  <option value="code">Source Code / Archive (.zip, .cpp, .py)</option>
                  <option value="link">Web Reference Link</option>
                </select>
              </div>

              {/* Guidelines card */}
              <div className="p-4 bg-gray-50 dark:bg-white/5 border-2 border-black/20 rounded-2xl text-xs space-y-1.5 font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5 text-black dark:text-white font-black uppercase text-[11px]">
                  <ShieldCheck size={14} className="text-brand-green" />
                  <span>KLU Academic Upload Guidelines</span>
                </div>
                <p>• Files are immediately synchronized with the database.</p>
                <p>• Students receive real-time notifications on new uploads.</p>
                <p>• Handouts with solutions should be clearly marked in the title.</p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-pink text-white border-3 border-black rounded-2xl font-black text-base shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <UploadCloud size={20} />
                <span>Publish Course Material</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
