"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import React from "react";

interface SubmitButtonProps {
    text?: string;
    href?: string;
    className?: string;
    bgClass?: string; 
    borderClass?: string; 
    textColor?: string;
    hoverColor?: string; 
    showArrow?: boolean; 
    arrow?: "left" | "right" | null; 
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
    text = "Get Started",
    className = "",
    bgClass = "bg-[#f58220]",
    hoverColor = "hover:bg-[#f37820]",
    borderClass = "border-transparent",
    textColor = "text-white",
    arrow = ""
}) => {
    return (
        <button
            type="submit"
            className={`inline-flex items-center z-100 justify-center gap-3 rounded-full border px-7 py-2 font-medium transition-all text-xs md:text-lg duration-300 
      ${bgClass} ${hoverColor} ${borderClass} ${textColor} ${className} hover:scale-105 border border-white cursor-pointer`}
        >
            {arrow && arrow === "left" ? (
                <MoveLeft className="w-4 h-4" />
            ) : null} {text} {arrow && arrow === "right" ? (
                <MoveRight className="w-4 h-4" />
            ) : null}
        </button>
    );
};

export default SubmitButton;
