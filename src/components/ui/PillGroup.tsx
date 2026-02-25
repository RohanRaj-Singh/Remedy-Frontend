"use client";
import React from "react";
import { useTranslation } from "react-i18next";

interface Option {
    label: string;
    value: string;
}

interface RadioGroupProps {
    name: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const PillGroup: React.FC<RadioGroupProps> = ({
    name,
    options,
    value,
    onChange,
    required = false,
}) => {
    const { t } = useTranslation("common");
    
    return (
        <div className="flex flex-wrap gap-3 mt-3">
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-full border px-6 py-2 text-sm font-medium transition-all duration-200 md:text-base ${
                      isSelected
                        ? "border-[#f37820] bg-[#126479] text-white"
                        : "border-gray-300 bg-white text-gray-800 hover:border-[#f37820]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={name}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => onChange(option.value)}
                      required={required}
                      className="hidden"
                    />
                    {option.label.startsWith("survey.") ? t(option.label) : option.label}
                  </label>
                );
            })}
        </div>
    );
};

export default PillGroup;