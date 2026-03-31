"use client";

import { ChevronDown } from "lucide-react";

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

export default function DashboardSelectInput({
    label,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    required = false,
}: SelectInputProps) {
    return (
        <div className="relative ">
            {label && (
                <label className="block text-sm md:text-lg font-medium md:font-bold text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className="block w-full appearance-none focus:appearance-none rounded-full md:w-3/5 border-2 border-white bg-gray-50 py-2.5 px-4 pr-10 text-gray-800 shadow-md   focus:border-white focus:ring-2 focus:ring-white focus:outline-none transition-all duration-200  cursor-pointer"


                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Chevron Icon */}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2  md:right-3/7 text-gray-500 pointer-events-none" />
            </div>
        </div>
    );
}
