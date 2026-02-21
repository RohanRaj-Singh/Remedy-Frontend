export interface Department {
  stream: string;
  functions: ReadonlyArray<{
    function: string;
    departments: ReadonlyArray<string>;
  }>;
}

export interface HierarchicalFilterProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  departments: ReadonlyArray<Department>;
  placeholder?: string;
  required?: boolean;
}
