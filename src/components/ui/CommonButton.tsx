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
  bgClass = "bg-[#126479]",
  hoverColor = "hover:bg-[#126479]/90",
  borderClass = "border-transparent",
  textColor = "text-white",
  arrow = "",
}) => {
  return (
    <Link
      href={href}
      className={`z-100 inline-flex items-center justify-center gap-3 rounded-full border px-7 py-2 text-xs font-medium transition-all duration-300 md:text-lg ${bgClass} ${hoverColor} ${borderClass} ${textColor} ${className} border border-white hover:scale-105`}
    >
      {arrow && arrow === "left" ? <MoveLeft className="h-4 w-4" /> : null} {text}{" "}
      {arrow && arrow === "right" ? <MoveRight className="h-4 w-4" /> : null}
    </Link>
  );
};

export default CommonButton;
