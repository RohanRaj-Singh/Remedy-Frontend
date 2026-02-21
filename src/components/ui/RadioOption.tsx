"use client";

import { translatedOptions } from "@/data/translateQuestion";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface RadioOptionProps {
  flowOption?: string;
  name: string;
  value: string;
  label: string;
  color?: string;
  checked: boolean;
  onChange: (value: string) => void;
  required?: boolean;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  flowOption,
  name,
  value,
  label,
  color = "green",
  checked,
  onChange,
  required = false,
}) => {
  const { t } = useTranslation("common");
  const { language } = useAppSelector((state) => state.ui);
  const [isEnglish, setIsEnglish] = useState(false);

  // Translate label if it's a translation key
  const translatedLabel = label.startsWith("survey.") ? t(label) : label;

  useEffect(() => {
    if (language === "en") {
      setIsEnglish(true);
    } else {
      setIsEnglish(false);
    }
  }, [language]);

  const getBorderClass = (isChecked: boolean) => {
    if (!isChecked) return "border-gray-300 group-hover:border-gray-400";

    switch (color) {
      case "blue":
        return "border-blue-500";
      case "purple":
        return "border-purple-500";
      case "yellow":
        return "border-yellow-500";
      case "red":
        return "border-red-500";
      case "green":
        return "border-green-500";
      default:
        return "border-green-500";
    }
  };

  const getBgClass = (isChecked: boolean) => {
    if (!isChecked) return "bg-transparent group-hover:bg-gray-200";

    switch (color) {
      case "blue":
        return "bg-blue-500";
      case "purple":
        return "bg-purple-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      case "green":
        return "bg-green-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <label className="group flex cursor-pointer items-center text-gray-800">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        required={required}
        className="hidden"
      />
      <span
        className={`mr-3 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${getBorderClass(checked)}`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${getBgClass(checked)}`}
        ></span>
      </span>
      {flowOption ? (
        <span className="text-sm font-medium">{translatedLabel}</span>
      ) : (
        <span className="text-sm font-medium">
          {isEnglish ? translatedLabel : translatedOptions.find((q) => q.english === label)?.arabic}
        </span>
      )}
    </label>
  );
};

export default RadioOption;
