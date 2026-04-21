"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ageOptions, genderOptions } from "@/data/survey";
import { 
  X, 
  Check,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from "lucide-react";

interface StreamHierarchy {
  [location: string]: {
    [fn: string]: string[];
  };
}

interface AttributeTemplate {
  hierarchy: {
    [stream: string]: StreamHierarchy;
  };
}

const DEFAULT_ATTRIBUTE_TEMPLATE: AttributeTemplate = {
  hierarchy: {
    Commercial: {
      headOffice: {
        Business_Development: ["Business_Development", "Mergers_And_Acquisitions"],
        Commercial: ["Commercial", "Economics_And_Planning"],
        Exploration: ["Exploration", "Exploration_Operated_Assets", "Exploration_Study_Or_Growth_Team"],
        Joint_Ventures: [
          "Joint_Ventures_Integrated_Gas",
          "Joint_Ventures",
          "Joint_Ventures_Business",
          "Joint_Ventures_Technical_Solution",
        ],
      },
    },
    Finance_And_Procurement: {
      headOffice: {
        Contract_And_Procurement: ["Contract_And_Procurement", "Contracts"],
        Finance_And_Procurement: [
          "BF_Non_Operated_Assets",
          "BF_Operated_Assets",
          "BF_Operated_Assets_Block_60_And_48",
          "Finance_And_Procurement",
          "Financial_Control",
          "Financial_Planning_And_Analysis",
          "Treasury",
        ],
      },
      block60: {
        Contract_And_Procurement: ["Material_Management"],
      },
    },
    Legal: {
      headOffice: {
        Legal: ["Legal"],
      },
    },
    Operated_Assets: {
      block60: {
        HSSE: ["HSE_Operated_Asset"],
        Projects_Delivery: ["Engineering", "Project_Technical_Services"],
        Subsurface_And_Operation_60_And_48: ["Operation_60_And_48_COE", "Subsurface", "Subsurface_And_Operation_60_And_48"],
      },
      msusundam: {
        HSSE: ["HSE_Operated_Asset"],
        Musandam_Cluster: ["Musandam_Cluster"],
        Subsurface_And_Operation_60_And_48: ["Subsurface_And_Operation_60_And_48"],
      },
      headOffice: {
        HSSE: ["HSE_Support", "HSSE", "OH_And_IH"],
        Operated_Assets: ["Operated_Assets", "Technical_Services", "Well_Delivery"],
        Projects_Delivery: ["Construction", "Major_Projects", "Off_Plot_Projects", "Projects_Delivery"],
        Subsurface_And_Operation_60_And_48: ["Budget_And_Cost_Control", "Growth_And_Planning"],
      },
    },
    OQ_Exploration_And_Production: {
      headOffice: {
        OQ_Exploration_And_Production: ["OQ_Exploration_And_Production"],
      },
    },
    People_Technology_And_Culture: {
      headOffice: {
        Communications_And_Branding: ["Communications_And_Branding"],
        Corporate_Support_Service: ["Corporate_Support_Service"],
        IDS_And_CI: ["IDS", "IDS_And_CI"],
        People_And_Strategy: ["People", "People_And_Strategy"],
        People_Technology_And_Culture: ["People_Technology_And_Culture"],
      },
      block60: {
        Corporate_Support_Service: ["Corporate_Support_Service"],
        IDS_And_CI: ["IDS", "IDS_And_CI"],
      },
      msusundam: {
        Corporate_Support_Service: ["Corporate_Support_Service"],
        IDS_And_CI: ["IDS", "IDS_And_CI"],
      },
    },
  },
};

function getStreams(): string[] {
  return Object.keys(DEFAULT_ATTRIBUTE_TEMPLATE.hierarchy);
}

function getLocations(stream: string): string[] {
  const hierarchy = DEFAULT_ATTRIBUTE_TEMPLATE.hierarchy[stream];
  return hierarchy ? Object.keys(hierarchy) : [];
}

function getFunctions(stream: string, location: string): string[] {
  const locationData = DEFAULT_ATTRIBUTE_TEMPLATE.hierarchy[stream]?.[location];
  return locationData ? Object.keys(locationData) : [];
}

function getDepartments(stream: string, location: string, fn: string): string[] {
  const functionData = DEFAULT_ATTRIBUTE_TEMPLATE.hierarchy[stream]?.[location]?.[fn];
  return functionData || [];
}

export interface FilterState {
  stream: string;
  location: string;
  fn: string;
  department: string;
  age: string;
  gender: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
  showActiveFilters?: boolean;
  rollUpActive?: boolean;
}

export const initialFilterState: FilterState = {
  stream: "",
  location: "",
  fn: "",
  department: "",
  age: "",
  gender: "",
};

export function checkHasActiveFilters(filters: FilterState): boolean {
  return Object.values(filters).some((v) => v !== "");
}

const locationDisplayMap: Record<string, string> = {
  block60: "B60",
  msusundam: "Musandam",
  headOffice: "Muscat",
};

interface FilterSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

function FilterSelect({ label, value, onChange, options, placeholder = "Select" }: FilterSelectProps) {
  const { t } = useTranslation("common");

  const translateLabel = (text: string) => {
    return text.startsWith("survey.") ? t(text) : text;
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 pr-8 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-800 cursor-pointer transition-all duration-150 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none appearance-none"
      >
        <option value="">{translateLabel(placeholder)}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {translateLabel(opt.label)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

interface FilterPillProps {
  label: string;
  value: string;
  color: string;
  onRemove: () => void;
}

function FilterPill({ label, value, color, onRemove }: FilterPillProps) {
  return (
    <button
      onClick={onRemove}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} hover:opacity-80 transition-opacity`}
      title={`${label}: ${value}`}
    >
      <span className="max-w-[100px] truncate">{value}</span>
      <X className="h-3 w-3 flex-shrink-0" />
    </button>
  );
}

export default function DashboardFilters({
  filters,
  onFilterChange,
  onApply,
  onReset,
  isLoading = false,
  showActiveFilters = true,
  rollUpActive = false,
}: DashboardFiltersProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  
  const availableLocations = filters.stream ? getLocations(filters.stream) : [];
  const availableFunctions = filters.stream && filters.location ? getFunctions(filters.stream, filters.location) : [];
  const availableDepartments = filters.stream && filters.location && filters.fn 
    ? getDepartments(filters.stream, filters.location, filters.fn)
    : [];

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    onFilterChange(key, value);
    
    if (key === "stream") {
      onFilterChange("location", "");
      onFilterChange("fn", "");
      onFilterChange("department", "");
    } else if (key === "location") {
      onFilterChange("fn", "");
      onFilterChange("department", "");
    } else if (key === "fn") {
      onFilterChange("department", "");
    }
  }, [onFilterChange]);

  const isFilterActive = checkHasActiveFilters(filters);
  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with filter count - click to expand on mobile */}
      <button
        type="button"
        onClick={() => setMobileExpanded(!mobileExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-blue-500 text-white text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {mobileExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Mobile collapsible filter panel */}
      {mobileExpanded && (
        <div className="p-4 space-y-3 bg-gradient-to-b from-slate-50 to-blue-50 lg:hidden">
          <div className="grid grid-cols-1 gap-3">
            <FilterSelect
              value={filters.stream}
              onChange={(value) => handleFilterChange("stream", value)}
              options={getStreams().map((stream) => ({
                label: stream.replace(/_/g, " "),
                value: stream,
              }))}
              placeholder="Select Stream"
            />

            {filters.stream && (
              <FilterSelect
                value={filters.location}
                onChange={(value) => handleFilterChange("location", value)}
                options={availableLocations.map((loc) => ({
                  label: locationDisplayMap[loc] || loc,
                  value: loc,
                }))}
                placeholder="Select Location"
              />
            )}

            {filters.stream && filters.location && (
              <FilterSelect
                value={filters.fn}
                onChange={(value) => handleFilterChange("fn", value)}
                options={availableFunctions.map((func) => ({
                  label: func.replace(/_/g, " "),
                  value: func,
                }))}
                placeholder="Select Function"
              />
            )}

            {filters.stream && filters.location && filters.fn && (
              <FilterSelect
                value={filters.department}
                onChange={(value) => handleFilterChange("department", value)}
                options={availableDepartments.map((dept) => ({
                  label: dept.replace(/_/g, " "),
                  value: dept,
                }))}
                placeholder="Select Department"
              />
            )}

            <FilterSelect
              value={filters.age}
              onChange={(value) => handleFilterChange("age", value)}
              options={[...ageOptions]}
              placeholder="Select Age"
            />

            <FilterSelect
              value={filters.gender}
              onChange={(value) => handleFilterChange("gender", value)}
              options={[...genderOptions]}
              placeholder="Select Gender"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {rollUpActive && (
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">
                  Roll Up
                </span>
              )}
              {isLoading && (
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isFilterActive && !isLoading && (
                <>
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={onApply}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Apply
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Horizontal filter bar - Desktop always visible / Mobile hidden */}
      <div className="hidden lg:block p-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Always show Stream - first in hierarchy */}
          <div className="w-48 min-w-[140px]">
            <FilterSelect
              value={filters.stream}
              onChange={(value) => handleFilterChange("stream", value)}
              options={getStreams().map((stream) => ({
                label: stream.replace(/_/g, " "),
                value: stream,
              }))}
              placeholder="All Streams"
            />
          </div>

          {filters.stream && (
            <div className="w-36 min-w-[120px]">
              <FilterSelect
                value={filters.location}
                onChange={(value) => handleFilterChange("location", value)}
                options={availableLocations.map((loc) => ({
                  label: locationDisplayMap[loc] || loc,
                  value: loc,
                }))}
                placeholder="All Locations"
              />
            </div>
          )}

          {filters.stream && filters.location && (
            <div className="w-44 min-w-[140px]">
              <FilterSelect
                value={filters.fn}
                onChange={(value) => handleFilterChange("fn", value)}
                options={availableFunctions.map((func) => ({
                  label: func.replace(/_/g, " "),
                  value: func,
                }))}
                placeholder="All Functions"
              />
            </div>
          )}

          {filters.stream && filters.location && filters.fn && (
            <div className="w-48 min-w-[150px]">
              <FilterSelect
                value={filters.department}
                onChange={(value) => handleFilterChange("department", value)}
                options={availableDepartments.map((dept) => ({
                  label: dept.replace(/_/g, " "),
                  value: dept,
                }))}
                placeholder="All Departments"
              />
            </div>
          )}

          <div className="w-32 min-w-[110px]">
            <FilterSelect
              value={filters.age}
              onChange={(value) => handleFilterChange("age", value)}
              options={[...ageOptions]}
              placeholder="All Ages"
            />
          </div>

          <div className="w-32 min-w-[110px]">
            <FilterSelect
              value={filters.gender}
              onChange={(value) => handleFilterChange("gender", value)}
              options={[...genderOptions]}
              placeholder="All Genders"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {rollUpActive && (
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">
                Roll Up
              </span>
            )}
            
            {isLoading ? (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : isFilterActive ? (
              <>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onApply}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  Apply
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Active Filter Pills - Desktop & Mobile */}
      {showActiveFilters && isFilterActive && (
        <div className="px-3 py-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.stream && (
              <FilterPill
                label="Stream"
                value={filters.stream.replace(/_/g, " ")}
                color="bg-blue-100 text-blue-700"
                onRemove={() => handleFilterChange("stream", "")}
              />
            )}
            {filters.location && (
              <FilterPill
                label="Location"
                value={locationDisplayMap[filters.location] || filters.location}
                color="bg-amber-100 text-amber-700"
                onRemove={() => handleFilterChange("location", "")}
              />
            )}
            {filters.fn && (
              <FilterPill
                label="Function"
                value={filters.fn.replace(/_/g, " ")}
                color="bg-indigo-100 text-indigo-700"
                onRemove={() => handleFilterChange("fn", "")}
              />
            )}
            {filters.department && (
              <FilterPill
                label="Department"
                value={filters.department.replace(/_/g, " ")}
                color="bg-purple-100 text-purple-700"
                onRemove={() => handleFilterChange("department", "")}
              />
            )}
            {filters.age && (
              <FilterPill
                label="Age"
                value={filters.age}
                color="bg-green-100 text-green-700"
                onRemove={() => handleFilterChange("age", "")}
              />
            )}
            {filters.gender && (
              <FilterPill
                label="Gender"
                value={filters.gender}
                color="bg-pink-100 text-pink-700"
                onRemove={() => handleFilterChange("gender", "")}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}