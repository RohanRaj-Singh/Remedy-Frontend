"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import RadioOption from "./RadioOption";

interface Option {
    label: string;
    value: string;
}

interface RadioGroupProps {
    name: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    color?: "blue" | "purple" | "yellow" | "red" | "green";
    required?: boolean;
    label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    options,
    value,
    onChange,
    color = "green",
    required = false,
    label,
}) => {
    const { t } = useTranslation("common");
    
    // Translate label if it's a translation key
    const translatedLabel = label && label.startsWith("survey.") ? t(label) : label;
    
    return (
        <div className="space-y-2">
            {translatedLabel && (
                <p className="text-sm font-medium text-gray-700 pb-4">{translatedLabel}</p>
            )}
            {options.map((option) => (
                <RadioOption
                    flowOption={"fromOption"}
                    key={option.value}
                    name={name}
                    value={option.value}
                    label={option.label.startsWith("survey.") ? t(option.label) : option.label}
                    color={color}
                    checked={value === option.value}
                    onChange={onChange}
                    required={required}
                />
            ))}
        </div>
    );
};

export default RadioGroup;