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
}

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}: SelectInputProps) {
  const { t } = useTranslation("common");

  // Translate placeholder if it's a translation key
  const translatedPlaceholder = placeholder.startsWith("survey.") ? t(placeholder) : placeholder;

  return (
    <div className="relative">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 md:text-lg md:font-bold">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className="block w-full cursor-pointer appearance-none rounded-full border-2 border-white bg-gray-50 px-4 py-2.5 pr-10 text-gray-800 shadow-md transition-all duration-200 focus:appearance-none focus:border-white focus:ring-2 focus:ring-white focus:outline-none md:w-3/5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        >
          <option value="">{translatedPlaceholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt?.label?.startsWith("survey.") ? t(opt?.label) : opt?.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 md:right-3/7" />
      </div>
    </div>
  );
}
