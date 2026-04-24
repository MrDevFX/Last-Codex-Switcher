export type ThemeMode = "light" | "dark";
export type AppView = "home" | "settings";
export type ConfigModalMode = "slim_export" | "slim_import";
export type SortMode = "deadline_asc" | "deadline_desc" | "remaining_desc" | "remaining_asc";

export interface ToastState {
  message: string;
  isError: boolean;
}
