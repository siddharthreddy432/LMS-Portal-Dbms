import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  X,
  Send,
  Maximize2,
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  FileText,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLMS } from '../context/LMSContext';
import { FormattedResponse } from '../utils/formatResponse';

interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AITutorWidget() {
  const navigate = useNavigate();
  const { courses } = useLMS();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('25SC1204E');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<WidgetMessage[]>([
    {
      id: 'wm-welcome',
      role: 'assistant',
      content: `Welcome to the **Academic Help Desk** for KL University coursework.\n\nSelect your subject and submit any question regarding algorithms, database normal forms, lab implementations, or exam syllabus topics.`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || input;
    if (!text.trim() || loading) return;

    const userMsg: WidgetMessage = {
      id: `w-user-${Date.now()}`,
      role: 'user',
      content: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/doubt-chat', {
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

      const data = await res.json();
      const botMsg: WidgetMessage = {
        id: `w-bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Could you provide more context or specific code lines for this problem?"
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `w-bot-${Date.now()}`,
          role: 'assistant',
          content: 'Academic Desk Notice: Review the syllabus slides in My Courses or test boundary conditions in your code.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Academic Utility Tool Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-[94vw] sm:w-[440px] h-[540px] bg-white dark:bg-[#181B20] border border-black/20 dark:border-white/15 rounded-2xl shadow-xl overflow-hidden flex flex-col mb-3"
          >
            {/* Utility Header - Clean Institutional University Portal Styling */}
            <div className="bg-brand-yellow text-black border-b-2 border-black dark:bg-[#15181D] dark:text-white dark:border-white/10 px-4 py-3 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white/10 dark:text-white flex items-center justify-center border border-black dark:border-white/15">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-black dark:text-white tracking-wide">
                      Academic Help Desk
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] text-black/75 dark:text-gray-400 block leading-tight font-medium">
                    Course doubt solver & concept assistant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/help-desk');
                  }}
                  className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-gray-300 transition-colors"
                  title="Expand to Full Page"
                >
                  <Maximize2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-gray-300 transition-colors"
                  title="Close Help Desk"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Subject Context Selector */}
            <div className="bg-gray-50 dark:bg-[#14161A] px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3 text-xs">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Active Subject:
              </span>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-white dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/20"
              >
                {courses.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} · {c.name.substring(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Dialogue Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl p-3.5 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-black text-white dark:bg-white dark:text-black font-medium'
                        : 'bg-gray-100 dark:bg-[#1E2228] text-[var(--text-primary)] border border-gray-200/60 dark:border-white/5'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-400 mb-1">
                      {msg.role === 'user' ? 'Student Inquiry' : 'Academic Response'}
                    </div>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <FormattedResponse content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-[#1E2228] border border-gray-200/60 dark:border-white/5 rounded-xl px-3 py-2 text-xs font-medium text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse delay-200" />
                    <span className="text-[11px] text-gray-400">Resolving academic query...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reference Inquiries */}
            <div className="px-3.5 py-2 bg-gray-50 dark:bg-[#14161A] border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => handleSend('Explain AVL tree balance rotations with a C++ example')}
                className="px-2.5 py-1 bg-white dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-md text-[11px] font-medium text-[var(--text-primary)] hover:border-black dark:hover:border-white/30 whitespace-nowrap transition-colors"
              >
                AVL Rotations
              </button>
              <button
                type="button"
                onClick={() => handleSend('Explain the difference between 3NF and BCNF with prime attributes')}
                className="px-2.5 py-1 bg-white dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-md text-[11px] font-medium text-[var(--text-primary)] hover:border-black dark:hover:border-white/30 whitespace-nowrap transition-colors"
              >
                3NF vs BCNF
              </button>
              <button
                type="button"
                onClick={() => handleSend('How does React 19 useOptimistic rollback on rejected server promises?')}
                className="px-2.5 py-1 bg-white dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 rounded-md text-[11px] font-medium text-[var(--text-primary)] hover:border-black dark:hover:border-white/30 whitespace-nowrap transition-colors"
              >
                React 19 Optimistic
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-gray-200 dark:border-white/10 flex items-center gap-2 bg-white dark:bg-[#181B20]"
            >
              <input
                type="text"
                placeholder="Ask doubt about this course (e.g. proof, algorithm, code)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-gray-50 dark:bg-[#14161A] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white/20"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3.5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <Send size={12} />
                <span>Submit</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger - Clean Native Academic Utility Button */}
      <motion.button
        whileHover={{ translateY: -1 }}
        whileTap={{ translateY: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 bg-white dark:bg-[#181B20] text-[var(--text-primary)] border border-black/20 dark:border-white/15 rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        aria-label="Open Academic Help Desk"
      >
        <div className="w-5 h-5 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
          <GraduationCap size={13} />
        </div>
        <span className="font-semibold text-xs tracking-tight">
          {isOpen ? 'Close Help Desk' : 'Academic Help Desk'}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </motion.button>
    </div>
  );
}
