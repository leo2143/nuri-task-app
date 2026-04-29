export interface FilterOption {
  value: string;
  label: string;
}

export interface ChipFilterConfig {
  key: string;
  label: string;
  type: "chips";
  options: FilterOption[];
}

export interface DateFilterConfig {
  key: string;
  label: string;
  type: "date";
}

export interface ToggleFilterConfig {
  key: string;
  label: string;
  type: "toggle";
}

export type FilterConfig = ChipFilterConfig | DateFilterConfig | ToggleFilterConfig;

export type FilterValues = Record<string, string | boolean | undefined>;
