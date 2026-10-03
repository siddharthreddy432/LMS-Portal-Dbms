import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  BookOpen,
  Trash2,
  ArrowLeft,
  GraduationCap,
  FileText,
  Search,
  CheckCircle2,
  HelpCircle,
  Compass
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLMS } from '../context/LMSContext';
import { FormattedResponse } from '../utils/formatResponse';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  courseCode?: string;
}

export default function AIDoubtTutorPage() {
  const navigate = useNavigate();
  const { courses } = useLMS();

  const [selectedCourse, setSelectedCourse] = useState<string>('25SC1204E');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Welcome to the **Academic Help Desk** for KL University coursework.\n\nSelect your enrolled subject and submit any question regarding algorithm proofs, database schemas, code debugging, or syllabus preparations.`,
      timestamp: 'Just now',
      courseCode: 'General'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    { label: 'AVL Tree Rotations', prompt: 'Can you explain the 4 AVL tree rotation cases (LL, RR, LR, RL) with an intuitive C++ example?' },
    { label: '3NF vs BCNF Invariants', prompt: 'What is the precise mathematical difference between 3NF and BCNF? How do candidate keys determine it?' },
    { label: 'React 19 Optimistic UI', prompt: 'How does React 19 useOptimistic handle rejected server promises and rollback state?' },
    { label: 'SVD & Dimensionality', prompt: 'How does Singular Value Decomposition (SVD) work and why is it used for dimensionality reduction in AI?' },
    { label: 'RISC-V Pipeline Hazards', prompt: 'Explain the 3 types of pipeline hazards in a 5-stage RISC-V processor (Structural, Data, Control).' }
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      courseCode: selectedCourse
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/doubt-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDoubt: text.trim(),
          courseCode: selectedCourse,
          messages: messages.concat(userMsg).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          }))
        })
      });

      const data = await response.json();
      const replyContent = data.reply || data.error || 'Unable to process inquiry. Please check your query or rephrase.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        courseCode: selectedCourse
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `Academic Desk Notice: Review the syllabus slides in My Courses or test boundary conditions in your code.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        courseCode: selectedCourse
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        role: 'assistant',
        content: 'Session cleared. Enter an inquiry or select a suggested topic to begin.',
        timestamp: 'Just now',
        courseCode: selectedCourse
      }
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 bg-white dark:bg-[#181B20] border border-gray-200 dark:border-white/10 rounded-lg font-medium text-xs text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-[#20242B] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to="/courses"
            className="px-3 py-1.5 bg-gray-100 dark:bg-[#22262E] text-[var(--text-primary)] border border-gray-200 dark:border-white/10 rounded-lg font-medium text-xs hover:bg-gray-200 dark:hover:bg-[#2B303A] transition-colors"
          >
            My Courses
          </Link>
          <button
            onClick={clearChat}
            className="px-3 py-1.5 bg-white dark:bg-[#181B20] text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 border border-gray-200 dark:border-white/10 rounded-lg font-medium text-xs flex items-center gap-1 transition-colors"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* University Portal Header Banner - Fully Themed for Light & Dark Modes */}
      <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-brand-pink/15 text-brand-pink dark:bg-white/10 dark:text-white border border-brand-pink/30 dark:border-white/15 text-xs font-black rounded-md">
                Academic Help Desk
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              <span className="text-xs text-[var(--text-secondary)] font-bold">Semester II Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[var(--text-primary)] tracking-tight">
              Coursework & Doubt Solver Desk
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">
              Verify conceptual understanding, debug programming assignments, analyze mathematical proofs, and review examination topics.
            </p>
          </div>

          {/* Subject Context Selector */}
          <div className="bg-gray-50 dark:bg-[#15181D] border-2 border-black dark:border-white/20 rounded-xl p-3 flex flex-col gap-1.5 self-start md:self-auto min-w-[240px]">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              Active Course Context:
            </span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white dark:bg-[#1B1F26] text-[var(--text-primary)] border border-black/20 dark:border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
            >
              <option value="General">All Engineering Subjects</option>
              {courses.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-1.5">
        <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider block">
          Frequent Syllabus Inquiries:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="px-3 py-1.5 bg-white dark:bg-[#1B1F26] border-2 border-black/20 dark:border-white/10 rounded-lg text-xs font-bold text-[var(--text-primary)] hover:border-black hover:bg-brand-yellow hover:text-black dark:hover:border-white/30 whitespace-nowrap transition-colors shadow-[1px_1px_0px_0px_#000]"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dialogue Panel */}
      <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col h-[58vh] sm:h-[62vh]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 text-[var(--text-primary)] border border-gray-200 dark:border-white/10 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  <GraduationCap size={16} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-blue text-white border-2 border-black dark:border-white/20 shadow-[2px_2px_0px_0px_#000] font-medium'
                    : 'bg-gray-50 dark:bg-[#15171C] text-[var(--text-primary)] border-2 border-black/10 dark:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2 pb-1 border-b border-black/10 dark:border-white/10">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                    {msg.role === 'user' ? 'Student Inquiry' : 'Academic Desk Response'}
                  </span>
                  <span className={`text-[10px] ${msg.role === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' ? (
                  <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <FormattedResponse content={msg.content} />
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-brand-blue text-white border-2 border-black dark:border-white/20 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_#000]">
                  SR
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 text-[var(--text-primary)] border border-gray-200 dark:border-white/10 flex items-center justify-center font-bold flex-shrink-0">
                <GraduationCap size={16} />
              </div>
              <div className="bg-gray-50 dark:bg-[#15171C] border border-gray-200/70 dark:border-white/5 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-200" />
                <span className="text-xs text-gray-500 font-medium">
                  Formulating step-by-step academic response...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Enter academic doubt or code question regarding ${selectedCourse}...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-gray-50 dark:bg-[#15171C] border-2 border-black/20 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white/30 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 bg-brand-pink text-white rounded-xl text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send size={13} />
              <span className="hidden sm:inline">Submit Query</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
