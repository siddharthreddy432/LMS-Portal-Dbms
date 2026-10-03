import React, { useState } from 'react';
import { Code2, Copy, Check, Info } from 'lucide-react';

/**
 * Cleanly converts raw LaTeX mathematical notation into readable, high-fidelity Unicode math.
 */
export function cleanMathText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Replace common LaTeX symbols with clean Unicode equivalents
  cleaned = cleaned
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\mathbb\{N\}/g, 'ℕ')
    .replace(/\\mathbb\{Z\}/g, 'ℤ')
    .replace(/\\mathbb\{C\}/g, 'ℂ')
    .replace(/\\mathcal\{O\}/g, 'O')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\ge(?![\w])/g, '≥')
    .replace(/\\le(?![\w])/g, '≤')
    .replace(/\\ne(?![\w])/g, '≠')
    .replace(/\\pm(?![\w])/g, '±')
    .replace(/\\in(?![\w])/g, '∈')
    .replace(/\\to(?![\w])/g, '→')
    .replace(/\\dots/g, '…')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\pi/g, 'π')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\quad/g, '  ')
    .replace(/\\log/g, 'log')
    .replace(/\^T\b/g, 'ᵀ')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/_1\b/g, '₁')
    .replace(/_2\b/g, '₂')
    .replace(/_k\b/g, 'ₖ')
    .replace(/_n\b/g, 'ₙ');

  // Strip standalone display math $$ ... $$ and inline math $ ... $
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  cleaned = cleaned.replace(/\$([^$]+)\$/g, '$1');

  return cleaned;
}

interface FormattedResponseProps {
  content: string;
}

export function FormattedResponse({ content }: FormattedResponseProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyCode = (codeKey: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedKey(codeKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Split code blocks (```lang ... ```)
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
      {parts.map((part, partIdx) => {
        if (part.startsWith('```')) {
          const firstBreak = part.indexOf('\n');
          const lang = part.slice(3, firstBreak).trim() || 'code';
          const codeBody = part.slice(firstBreak + 1, -3);
          const codeKey = `code-${partIdx}`;

          return (
            <div
              key={partIdx}
              className="my-3 rounded-xl border border-gray-800 bg-[#0d1117] text-white overflow-hidden shadow-sm"
            >
              <div className="bg-[#161b22] px-3.5 py-1.5 border-b border-gray-800 flex items-center justify-between text-xs font-mono text-gray-300">
                <span className="flex items-center gap-1.5 uppercase font-medium text-gray-300">
                  <Code2 size={13} /> {lang}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeKey, codeBody)}
                  className="hover:text-white flex items-center gap-1 font-sans text-[11px] font-medium text-gray-400 transition-colors"
                >
                  {copiedKey === codeKey ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                  <span>{copiedKey === codeKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-gray-100">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Process non-code markdown lines
        const lines = part.split('\n');

        return (
          <div key={partIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const cleanLine = cleanMathText(line).trim();
              if (!cleanLine) return <div key={lIdx} className="h-0.5" />;

              // Main Headings (### or ## or **)
              if (
                cleanLine.startsWith('### ') ||
                cleanLine.startsWith('## ') ||
                (cleanLine.startsWith('**') && cleanLine.endsWith('**') && cleanLine.length < 90 && !cleanLine.includes('.'))
              ) {
                const headerText = cleanLine
                  .replace(/^#{1,4}\s*/, '')
                  .replace(/^\*\*/, '')
                  .replace(/\*\*$/, '')
                  .trim();

                return (
                  <h3
                    key={lIdx}
                    className="text-sm sm:text-base font-semibold tracking-tight text-[var(--text-primary)] mt-3 mb-1"
                  >
                    {headerText}
                  </h3>
                );
              }

              // Subheadings (#### )
              if (cleanLine.startsWith('#### ')) {
                const subText = cleanLine.replace(/^####\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
                return (
                  <h4
                    key={lIdx}
                    className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-2.5 mb-1"
                  >
                    {subText}
                  </h4>
                );
              }

              // Mathematical equation block line (e.g. A = U · Σ · Vᵀ or formula centered)
              if (
                cleanLine.includes(' = ') &&
                (cleanLine.includes('·') || cleanLine.includes('Σ') || cleanLine.includes('ℝ') || cleanLine.includes('BF(') || cleanLine.includes('O(')) &&
                !cleanLine.startsWith('*') && !cleanLine.startsWith('-')
              ) {
                return (
                  <div
                    key={lIdx}
                    className="my-2 p-2.5 px-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg font-mono text-xs sm:text-sm font-semibold text-[var(--text-primary)]"
                  >
                    {cleanLine}
                  </div>
                );
              }

              // Special Theorem or Rule Callout
              if (
                cleanLine.toLowerCase().startsWith('**eckart–young') ||
                cleanLine.toLowerCase().startsWith('**eckart-young') ||
                cleanLine.toLowerCase().startsWith('**note:') ||
                cleanLine.toLowerCase().startsWith('**key takeaway:')
              ) {
                return (
                  <div
                    key={lIdx}
                    className="my-2.5 p-3 bg-gray-50 dark:bg-[#1E2228] border-l-2 border-l-black dark:border-l-white border-y border-r border-gray-200 dark:border-white/5 rounded-r-lg flex items-start gap-2.5"
                  >
                    <Info size={15} className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs font-medium leading-relaxed text-[var(--text-primary)]">
                      {parseLineSpans(cleanLine)}
                    </div>
                  </div>
                );
              }

              // Bullet points (* or - or numbered 1. 2.)
              const isBullet = cleanLine.startsWith('* ') || cleanLine.startsWith('- ');
              const isNumbered = /^\d+\.\s/.test(cleanLine);

              if (isBullet || isNumbered) {
                const bulletContent = isBullet
                  ? cleanLine.slice(2)
                  : cleanLine.replace(/^\d+\.\s*/, '');
                const bulletPrefix = isNumbered ? cleanLine.match(/^\d+\./)?.[0] : '•';

                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="font-extrabold text-brand-pink text-xs select-none mt-0.5 flex-shrink-0">
                      {bulletPrefix}
                    </span>
                    <div className="flex-1 font-medium text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                      {parseLineSpans(bulletContent)}
                    </div>
                  </div>
                );
              }

              // Regular paragraph
              return (
                <p key={lIdx} className="font-medium text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]">
                  {parseLineSpans(cleanLine)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Parses bold **text**, inline `code`, and links within a single line.
 */
function parseLineSpans(lineText: string): React.ReactNode {
  // First split by bold **...**
  const boldParts = lineText.split(/(\*\*.*?\*\*)/g);

  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      const boldInner = bPart.slice(2, -2);
      return (
        <strong key={bIdx} className="font-black text-[var(--text-primary)]">
          {parseInlineCode(boldInner)}
        </strong>
      );
    }
    return <span key={bIdx}>{parseInlineCode(bPart)}</span>;
  });
}

function parseInlineCode(text: string): React.ReactNode {
  const codeParts = text.split(/(`.*?`)/g);

  return codeParts.map((cPart, cIdx) => {
    if (cPart.startsWith('`') && cPart.endsWith('`')) {
      return (
        <code
          key={cIdx}
          className="mx-0.5 px-1.5 py-0.5 bg-brand-yellow/30 dark:bg-white/10 text-black dark:text-yellow-200 border border-black/30 rounded font-mono text-[11px] font-bold"
        >
          {cPart.slice(1, -1)}
        </code>
      );
    }
    return cPart;
  });
}
