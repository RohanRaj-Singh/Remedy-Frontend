"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Option {
  label: string;
  value: string;
}

interface Department {
  stream: string;
  functions: ReadonlyArray<{
    function: string;
    departments: ReadonlyArray<string>;
  }>;
}

// Type guard to check if options are Department objects
function isDepartmentOptions(
  options: Option[] | ReadonlyArray<Department>,
): options is ReadonlyArray<Department> {
  return options.length > 0 && "stream" in options[0];
}

interface MultiInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[] | ReadonlyArray<Department>;
  placeholder?: string;
  required?: boolean;
  isHierarchical?: boolean; // New prop to indicate hierarchical display
}

export default function MultiInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  isHierarchical = false, // Default to false for backward compatibility
}: MultiInputProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredStream, setHoveredStream] = useState<string | null>(null);
  const [hoveredFunction, setHoveredFunction] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const functionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredStream(null);
        setHoveredFunction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
      if (functionTimeoutRef.current) clearTimeout(functionTimeoutRef.current);
    };
  }, []);

  // Handle selection of a department
  const handleDepartmentSelect = (stream: string, func: string, department: string) => {
    const combinedValue = `${stream} > ${func} > ${department}`;
    onChange(combinedValue);
    setIsOpen(false);
    setHoveredStream(null);
    setHoveredFunction(null);
  };

  // Handle selection of a function (without department)
  const handleFunctionSelect = (stream: string, func: string) => {
    const combinedValue = `${stream} > ${func}`;
    onChange(combinedValue);
    setIsOpen(false);
    setHoveredStream(null);
    setHoveredFunction(null);
  };

  // Handle selection of a stream (without function or department)
  const handleStreamSelect = (stream: string) => {
    onChange(stream);
    setIsOpen(false);
    setHoveredStream(null);
    setHoveredFunction(null);
  };

  // Handle mouse enter for stream
  const handleStreamMouseEnter = (stream: string) => {
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }
    setHoveredStream(stream);
    setHoveredFunction(null);
  };

  // Handle mouse leave for stream
  const handleStreamMouseLeave = () => {
    if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
    streamTimeoutRef.current = setTimeout(() => {
      setHoveredStream(null);
      setHoveredFunction(null);
    }, 300); // Delay to allow smooth transition to function dropdown
  };

  // Handle mouse enter for function
  const handleFunctionMouseEnter = (func: string) => {
    if (functionTimeoutRef.current) {
      clearTimeout(functionTimeoutRef.current);
      functionTimeoutRef.current = null;
    }
    setHoveredFunction(func);
  };

  // Handle mouse leave for function
  const handleFunctionMouseLeave = () => {
    if (functionTimeoutRef.current) clearTimeout(functionTimeoutRef.current);
    functionTimeoutRef.current = setTimeout(() => {
      setHoveredFunction(null);
    }, 300); // Delay to allow smooth transition to department dropdown
  };

  // Translate placeholder if it's a translation key
  const translatedPlaceholder = placeholder.startsWith("survey.") ? t(placeholder) : placeholder;

  // Render hierarchical view when isHierarchical is true and options is department data
  if (isHierarchical && isDepartmentOptions(options)) {
    const departmentOptions = options;

    return (
      <div className="relative" ref={dropdownRef}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 md:text-lg md:font-bold">
            {label}
          </label>
        )}

        <div className="relative">
          <button
            type="button"
            className="block w-full cursor-pointer appearance-none rounded-full border-2 border-white bg-gray-50 px-4 py-2.5 pr-10 text-left text-gray-800 shadow-md transition-all duration-200 focus:appearance-none focus:border-white focus:ring-2 focus:ring-white focus:outline-none md:w-3/5"
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <div className="flex items-center justify-between">
              <span className="truncate">{value || translatedPlaceholder}</span>
              <ChevronDown
                className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </button>

          {isOpen && (
            <div className="ring-opacity-5 absolute left-0 z-50 mt-1 w-full min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black">
              <div className="flex max-h-96 overflow-hidden">
                <div className="w-1/3 border-r border-gray-200 bg-white py-1">
                  <div className="px-2 py-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Streams
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {departmentOptions.map((dept) => (
                      <div
                        key={dept.stream}
                        className={`relative flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 ${
                          value === dept.stream ? "bg-blue-50 text-blue-700" : ""
                        }`}
                        onMouseEnter={() => handleStreamMouseEnter(dept.stream)}
                        onMouseLeave={handleStreamMouseLeave}
                        onClick={() => handleStreamSelect(dept.stream)}
                      >
                        <span className="truncate">{dept.stream}</span>
                        {dept.functions.length > 0 && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {hoveredStream && (
                  <div
                    className="w-1/3 border-r border-gray-200 bg-white py-1"
                    onMouseEnter={() => {
                      if (streamTimeoutRef.current) {
                        clearTimeout(streamTimeoutRef.current);
                        streamTimeoutRef.current = null;
                      }
                    }}
                    onMouseLeave={handleStreamMouseLeave}
                  >
                    <div className="px-2 py-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Functions
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {departmentOptions
                        .find((d) => d.stream === hoveredStream)
                        ?.functions.map((func) => (
                          <div
                            key={func.function}
                            className={`relative flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 ${
                              value === `${hoveredStream} > ${func.function}`
                                ? "bg-blue-50 text-blue-700"
                                : ""
                            }`}
                            onMouseEnter={() => handleFunctionMouseEnter(func.function)}
                            onMouseLeave={handleFunctionMouseLeave}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFunctionSelect(hoveredStream, func.function);
                            }}
                          >
                            <span className="truncate">{func.function}</span>
                            {func.departments.length > 0 && (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {hoveredStream && hoveredFunction && (
                  <div
                    className="w-1/3 bg-white py-1"
                    onMouseEnter={() => {
                      if (functionTimeoutRef.current) {
                        clearTimeout(functionTimeoutRef.current);
                        functionTimeoutRef.current = null;
                      }
                    }}
                    onMouseLeave={handleFunctionMouseLeave}
                  >
                    <div className="px-2 py-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Departments
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {departmentOptions
                        .find((d) => d.stream === hoveredStream)
                        ?.functions.find((f) => f.function === hoveredFunction)
                        ?.departments.map((dept) => (
                          <div
                            key={dept}
                            className={`cursor-pointer truncate px-4 py-2 text-sm hover:bg-gray-100 ${
                              value === `${hoveredStream} > ${hoveredFunction} > ${dept}`
                                ? "bg-blue-50 text-blue-700"
                                : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDepartmentSelect(hoveredStream, hoveredFunction, dept);
                            }}
                          >
                            {dept}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render traditional select dropdown for non-hierarchical options
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
          {(options as Option[]).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt?.label?.startsWith("survey.") ? t(opt?.label) : opt?.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 md:right-3/7" />
      </div>
    </div>
  );
}
