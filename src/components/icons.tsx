import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 10.5 12 4l8 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 9.5V20h11V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path
        d="m14.1 3 .4 1.8c.1.4.4.7.8.9l.8.3c.4.1.8.1 1.1-.1l1.6-1 1.5 1.5-1 1.6c-.2.3-.2.7-.1 1.1l.3.8c.2.4.5.7.9.8l1.8.4v2.2l-1.8.4c-.4.1-.7.4-.9.8l-.3.8c-.1.4-.1.8.1 1.1l1 1.6-1.5 1.5-1.6-1c-.3-.2-.7-.2-1.1-.1l-.8.3c-.4.2-.7.5-.8.9l-.4 1.8h-2.2l-.4-1.8c-.1-.4-.4-.7-.8-.9l-.8-.3c-.4-.1-.8-.1-1.1.1l-1.6 1-1.5-1.5 1-1.6c.2-.3.2-.7.1-1.1l-.3-.8c-.2-.4-.5-.7-.9-.8l-1.8-.4v-2.2l1.8-.4c.4-.1.7-.4.9-.8l.3-.8c.1-.4.1-.8-.1-1.1l-1-1.6 1.5-1.5 1.6 1c.3.2.7.2 1.1.1l.8-.3c.4-.2.7-.5.8-.9l.4-1.8h2.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m3 3 18 18" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-3.2 3.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6 6.7A15.4 15.4 0 0 0 2.5 12s3.5 7 9.5 7c1.4 0 2.7-.3 3.9-.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9A3 3 0 0 0 14.1 14.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 6v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 11a8 8 0 1 0 2 5.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M20.3 14.8A8.5 8.5 0 0 1 9.2 3.7 9 9 0 1 0 20.3 14.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArchiveUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16v4H4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11v7h12v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16V9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 11.5 2.5-2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArchiveDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16v4H4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11v7h12v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9v7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 13.5 2.5 2.5 2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M12 3 5 6v5c0 5 3.3 8.8 7 10 3.7-1.2 7-5 7-10V6l-7-3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9.5 12 1.8 1.8L15 10.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MinimizeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function WindowMinimizeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 46 32" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M18 16.5h10" />
    </svg>
  );
}

export function MaximizeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="5" y="5" width="14" height="14" rx="1" />
    </svg>
  );
}

export function WindowMaximizeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 46 32" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <rect x="18.5" y="10.5" width="9" height="9" />
    </svg>
  );
}

export function FullscreenIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4" strokeLinecap="round" />
      <path d="M9 9 4.5 4.5M15 9l4.5-4.5M15 15l4.5 4.5M9 15l-4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

export function RestoreIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M9 9h10v10H9z" />
      <path d="M5 15V5h10" strokeLinecap="round" />
    </svg>
  );
}

export function WindowRestoreIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 46 32" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M17.5 13.5h7v7h-7z" />
      <path d="M21.5 9.5h7v7h-4" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WindowCloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 46 32" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="m18.5 10.5 9 9M27.5 10.5l-9 9" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v4M14 11v4" strokeLinecap="round" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14 19 5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 19V5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m6 11 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
