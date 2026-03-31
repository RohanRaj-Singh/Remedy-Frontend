"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CommonButtonProps {
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

const CommonButton: React.FC<CommonButtonProps> = ({
    text = "Get Started",
    href = "#",
    className = "",
    bgClass = "bg-[#f58220]",
    hoverColor = "hover:bg-[#f37820]",
    borderClass = "border-transparent",
    textColor = "text-white",
    arrow = ""
}) => {
    return (
        <Link
            href={href}
            className={`inline-flex items-center z-100 justify-center gap-3 rounded-full border px-7 py-2 font-medium transition-all text-xs md:text-lg duration-300 
      ${bgClass} ${hoverColor} ${borderClass} ${textColor} ${className} hover:scale-105 border border-white`}
        >
            {arrow && arrow === "left" ? (
                <MoveLeft className="w-4 h-4" />
            ) : null} {text} {arrow && arrow === "right" ? (
                <MoveRight className="w-4 h-4" />
            ) : null}
        </Link>
    );
};

export default CommonButton;
