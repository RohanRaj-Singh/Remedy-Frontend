"use client";

import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  compact = false,
}: SelectInputProps) {
  const { t } = useTranslation("common");

  const translatedPlaceholder = placeholder.startsWith("survey.") ? t(placeholder) : placeholder;

  const baseClasses = compact
    ? "w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs text-gray-700 transition-all duration-150 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none hover:border-gray-300"
    : "block w-full appearance-none rounded-full border-2 border-white bg-gray-50 px-4 py-2.5 pr-10 text-gray-800 shadow-md transition-all duration-200 focus:appearance-none focus:border-white focus:ring-2 focus:ring-white focus:outline-none";

  return (
    <div className={compact ? "relative" : "relative"}>
      {label && (
        <label className={`mb-1 block font-medium text-gray-700 ${compact ? "text-xs" : "text-sm md:text-lg md:font-bold"}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`${baseClasses} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
        >
          <option value="">{translatedPlaceholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt?.label?.startsWith("survey.") ? t(opt?.label) : opt?.label}
            </option>
          ))}
        </select>

        <ChevronDown className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${compact ? "right-2 h-3 w-3" : "right-3 md:right-3/7 h-4 w-4"}`} />
      </div>
    </div>
  );
}