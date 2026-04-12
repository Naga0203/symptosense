import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import { SYMPTOM_SUGGESTIONS } from '../../constants';

interface SymptomInputProps {
  /** Comma-separated symptom string */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SymptomInput({ value, onChange, placeholder }: SymptomInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current chips from value
  const selectedSymptoms = value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  // Filter suggestions
  const filtered = SYMPTOM_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(query.toLowerCase()) &&
      !selectedSymptoms.some((sel) => sel.toLowerCase() === s.toLowerCase())
  );

  const addSymptom = useCallback(
    (symptom: string) => {
      const trimmed = symptom.trim();
      if (!trimmed) return;
      // Avoid duplicates (case-insensitive)
      if (selectedSymptoms.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
      const next = [...selectedSymptoms, trimmed].join(', ');
      onChange(next);
      setQuery('');
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [selectedSymptoms, onChange]
  );

  const removeSymptom = useCallback(
    (index: number) => {
      const next = selectedSymptoms.filter((_, i) => i !== index).join(', ');
      onChange(next);
    },
    [selectedSymptoms, onChange]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        addSymptom(filtered[activeIndex]);
      } else if (query.trim()) {
        addSymptom(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'Backspace' && !query && selectedSymptoms.length > 0) {
      removeSymptom(selectedSymptoms.length - 1);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Chips + Input area */}
      <div
        className="flex flex-wrap items-center gap-2 w-full bg-black/40 border border-gray-800 rounded-2xl p-4 min-h-[56px] focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedSymptoms.map((symptom, i) => (
          <span
            key={`${symptom}-${i}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-xl text-sm font-medium animate-fade-in-up"
          >
            {symptom}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSymptom(i);
              }}
              className="hover:text-white transition-colors"
              aria-label={`Remove ${symptom}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <Search className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedSymptoms.length === 0 ? (placeholder || 'Type a symptom...') : 'Add more...'}
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="symptom-listbox"
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          id="symptom-listbox"
          role="listbox"
          className="absolute z-50 w-full mt-2 max-h-52 overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-gray-700/60 rounded-2xl shadow-2xl py-2 custom-scrollbar animate-fade-in-up"
        >
          {filtered.map((symptom, i) => (
            <li
              key={symptom}
              role="option"
              aria-selected={i === activeIndex}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                i === activeIndex
                  ? 'bg-cyan-500/15 text-cyan-300'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
              onMouseDown={() => addSymptom(symptom)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 flex-shrink-0" />
              {symptom}
            </li>
          ))}
        </ul>
      )}

      {/* Helper text */}
      {selectedSymptoms.length > 0 && (
        <p className="mt-2 text-[11px] text-gray-600 font-medium">
          {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''} selected · Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-[10px]">↑↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 text-[10px]">Enter</kbd> to add
        </p>
      )}
    </div>
  );
}
