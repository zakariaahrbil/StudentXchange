"use client";

import { Search, X } from "lucide-react";

interface SkillSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SkillSearchBar({
  value,
  onChange,
  placeholder = "Search by skill (e.g. React, Calculus, Python) or university...",
}: SkillSearchBarProps) {
  return (
    <div className="relative flex items-center w-full bg-white border border-border focus-within:border-purple transition-colors">
      <div className="pl-4 pr-2 text-muted">
        <Search className="size-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3.5 pr-10 text-sm text-ink placeholder:text-muted outline-none bg-transparent font-medium"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3.5 text-muted hover:text-ink transition-colors p-1"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
