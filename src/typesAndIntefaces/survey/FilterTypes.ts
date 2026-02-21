export interface DepartmentItem {
  function: string;
  departments: ReadonlyArray<string>;
}

export interface StreamItem {
  stream: string;
  functions: ReadonlyArray<DepartmentItem>;
}