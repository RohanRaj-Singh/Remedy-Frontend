"use client";

import { departments } from "@/data/survey";
import { DepartmentItem, StreamItem } from "@/typesAndIntefaces/survey/FilterTypes";
import { useState } from "react";
export default function HoverDropdownFilter() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoverStream, setHoverStream] = useState<string | null>(null);
  const [hoverFunction, setHoverFunction] = useState<string | null>(null);

  const streamData: StreamItem | undefined = departments.find((s) => s.stream === hoverStream);

  const functionData: DepartmentItem | undefined = streamData?.functions.find(
    (f) => f.function === hoverFunction,
  );

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="rounded border bg-white px-4 py-2"
      >
        Select Stream
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 z-50 mt-2 flex border bg-white shadow-lg">
          <div className="w-60 border-r bg-white">
            {departments.map((stream) => (
              <div
                key={stream.stream}
                onMouseEnter={() => {
                  setHoverStream(stream.stream);
                  setHoverFunction(null);
                }}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              >
                {stream.stream}
              </div>
            ))}
          </div>

          {hoverStream && (
            <div className="w-60 border-r bg-white">
              {streamData?.functions.map((fn) => (
                <div
                  key={fn.function}
                  onMouseEnter={() => setHoverFunction(fn.function)}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                >
                  {fn.function}
                </div>
              ))}
            </div>
          )}

          {hoverFunction && (
            <div className="w-60 bg-white">
              {functionData?.departments.map((dep) => (
                <div key={dep} className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                  {dep}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
