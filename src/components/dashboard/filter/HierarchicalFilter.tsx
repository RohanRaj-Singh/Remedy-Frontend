"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Department {
  stream: string;
  functions: ReadonlyArray<{
    function: string;
    departments: ReadonlyArray<string>;
  }>;
}

interface HierarchicalFilterProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  departments: ReadonlyArray<Department>;
  placeholder?: string;
  // Note: 'required' prop is defined but not currently used in the component
  // It's kept for API consistency with other form components
  required?: boolean;
}

export default function HierarchicalFilter({
  label,
  value,
  onChange,
  departments,
  placeholder = "Select department hierarchy",
}: HierarchicalFilterProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredStream, setHoveredStream] = useState<string | null>(null);
  const [hoveredFunction, setHoveredFunction] = useState<string | null>(null);
  const [expandedStreams, setExpandedStreams] = useState<Record<string, boolean>>({});
  const [expandedFunctions, setExpandedFunctions] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const functionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredStream(null);
        setHoveredFunction(null);
        setExpandedStreams({});
        setExpandedFunctions({});
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
    setExpandedStreams({});
    setExpandedFunctions({});
  };

  // Handle selection of a function (without department)
  const handleFunctionSelect = (stream: string, func: string) => {
    const combinedValue = `${stream} > ${func}`;
    onChange(combinedValue);
    setIsOpen(false);
    setHoveredStream(null);
    setHoveredFunction(null);
    setExpandedStreams({});
    setExpandedFunctions({});
  };

  // Handle selection of "All"
  const handleAllSelect = () => {
    onChange("");
    setIsOpen(false);
    setHoveredStream(null);
    setHoveredFunction(null);
    setExpandedStreams({});
    setExpandedFunctions({});
  };

  // Handle selection of a stream (without function or department)
  const handleStreamSelect = (stream: string) => {
    onChange(stream);
    setIsOpen(false);
    setHoveredStream(null);
    setHoveredFunction(null);
    setExpandedStreams({});
    setExpandedFunctions({});
  };

  // Handle mouse enter for stream
  const handleStreamMouseEnter = (stream: string) => {
    if (isMobile) return; // Skip hover effects on mobile

    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }
    setHoveredStream(stream);
    setHoveredFunction(null);
  };

  // Handle mouse leave for stream
  const handleStreamMouseLeave = () => {
    if (isMobile) return; // Skip hover effects on mobile

    if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
    streamTimeoutRef.current = setTimeout(() => {
      setHoveredStream(null);
      setHoveredFunction(null);
    }, 1000); // Delay to allow smooth transition to function dropdown
  };

  // Handle mouse enter for function
  const handleFunctionMouseEnter = (func: string) => {
    if (isMobile) return; // Skip hover effects on mobile

    if (functionTimeoutRef.current) {
      clearTimeout(functionTimeoutRef.current);
      functionTimeoutRef.current = null;
    }
    setHoveredFunction(func);
  };

  // Handle mouse leave for function
  const handleFunctionMouseLeave = () => {
    if (isMobile) return; // Skip hover effects on mobile

    if (functionTimeoutRef.current) clearTimeout(functionTimeoutRef.current);
    functionTimeoutRef.current = setTimeout(() => {
      setHoveredFunction(null);
    }, 300); // Delay to allow smooth transition to department dropdown
  };

  // Toggle stream expansion (for mobile)
  const toggleStreamExpansion = (stream: string) => {
    setExpandedStreams((prev) => ({
      ...prev,
      [stream]: !prev[stream],
    }));
    // Reset function expansion when stream is toggled
    setExpandedFunctions({});
  };

  // Toggle function expansion (for mobile)
  const toggleFunctionExpansion = (func: string) => {
    setExpandedFunctions((prev) => ({
      ...prev,
      [func]: !prev[func],
    }));
  };

  // Translate placeholder if it's a translation key
  const translatedPlaceholder = placeholder.startsWith("survey.") ? t(placeholder) : placeholder;

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
          <div className="ring-opacity-5 absolute left-0 z-50 mt-1 w-full min-w-[200px] rounded-md bg-white shadow-lg ring-1 ring-black md:max-w-none">
            <div className="flex max-h-96 flex-col md:flex-row md:overflow-hidden">
              <div className="border-b border-gray-200 bg-white py-1 md:w-1/3 md:border-r">
                <div className="px-2 py-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Streams
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div
                    className={`relative flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 ${
                      value === "All" ? "bg-blue-50 text-blue-700" : ""
                    }`}
                    onClick={handleAllSelect}
                  >
                    <span className="truncate">All</span>
                  </div>
                  {departments.map((dept) => (
                    <div key={dept.stream}>
                      <div
                        className={`relative flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 ${
                          value === dept.stream || value.startsWith(`${dept.stream} >`)
                            ? "bg-blue-50 text-blue-700"
                            : ""
                        }`}
                        onMouseEnter={() => !isMobile && handleStreamMouseEnter(dept.stream)}
                        onMouseLeave={handleStreamMouseLeave}
                        onClick={() => {
                          if (isMobile) {
                            toggleStreamExpansion(dept.stream);
                          } else {
                            handleStreamSelect(dept.stream);
                          }
                        }}
                      >
                        <span className="truncate">{dept.stream}</span>
                        {dept.functions.length > 0 && (
                          <ChevronRight
                            className={`h-4 w-4 text-gray-400 transition-transform ${isMobile && expandedStreams[dept.stream] ? "rotate-90" : ""}`}
                          />
                        )}
                      </div>

                      {isMobile && expandedStreams[dept.stream] && (
                        <div className="bg-gray-50">
                          <div className="px-4 py-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Functions
                          </div>
                          {dept.functions.map((func) => (
                            <div key={func.function}>
                              <div
                                className={`relative flex cursor-pointer items-center justify-between px-6 py-2 text-sm hover:bg-gray-100 ${
                                  value === `${dept.stream} > ${func.function}` ||
                                  value.startsWith(`${dept.stream} > ${func.function} >`)
                                    ? "bg-blue-100 text-blue-700"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isMobile) {
                                    if (func.departments.length > 0) {
                                      toggleFunctionExpansion(func.function);
                                    } else {
                                      handleFunctionSelect(dept.stream, func.function);
                                    }
                                  }
                                }}
                              >
                                <span className="truncate">{func.function}</span>
                                {func.departments.length > 0 && (
                                  <ChevronRight
                                    className={`h-4 w-4 text-gray-400 transition-transform ${isMobile && expandedFunctions[func.function] ? "rotate-90" : ""}`}
                                  />
                                )}
                              </div>

                              {isMobile && expandedFunctions[func.function] && (
                                <div className="bg-gray-100">
                                  <div className="px-6 py-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Departments
                                  </div>
                                  {func.departments.map((deptName) => (
                                    <div
                                      key={deptName}
                                      className={`cursor-pointer truncate px-8 py-2 text-sm hover:bg-gray-200 ${
                                        value === `${dept.stream} > ${func.function} > ${deptName}`
                                          ? "bg-blue-100 text-blue-700"
                                          : ""
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDepartmentSelect(
                                          dept.stream,
                                          func.function,
                                          deptName,
                                        );
                                      }}
                                    >
                                      {deptName}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!isMobile && hoveredStream && (
                <div
                  className="border-b border-gray-200 bg-white py-1 md:w-1/3 md:border-r"
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
                    {departments
                      .find((d) => d.stream === hoveredStream)
                      ?.functions.map((func) => (
                        <div
                          key={func.function}
                          className={`relative flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 ${
                            value === `${hoveredStream} > ${func.function}` ||
                            value.startsWith(`${hoveredStream} > ${func.function} >`)
                              ? "bg-blue-50 text-blue-700"
                              : ""
                          }`}
                          onMouseEnter={() => handleFunctionMouseEnter(func.function)}
                          onMouseLeave={handleFunctionMouseLeave}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (func.departments.length > 0) {
                              // For desktop, we'd show departments in the next column
                              handleFunctionSelect(hoveredStream, func.function);
                            } else {
                              handleFunctionSelect(hoveredStream, func.function);
                            }
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

              {!isMobile && hoveredStream && hoveredFunction && (
                <div
                  className="bg-white py-1 md:w-1/3"
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
                    {departments
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
