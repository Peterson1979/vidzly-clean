
import React from 'react';

interface IconProps {
  className?: string;
  ariaHidden?: boolean;
  fill?: string; 
  strokeWidth?: string | number; // Allow strokeWidth to be passed as prop
}

// Helper to add default scaling attributes
const scaleAttrs = { width: "100%", height: "100%" };

export const SearchIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className, ariaHidden = true, fill = "currentColor" }) => (
  <svg {...scaleAttrs} className={className} fill={fill} viewBox="0 0 20 20" aria-hidden={ariaHidden}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
   <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.663 17h4.673M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 2L12 6M12 18v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1.636 12H4M20 12h2.364M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => ( 
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export const HeartFilledIcon: React.FC<IconProps> = ({ className, ariaHidden = true, fill="currentColor", strokeWidth = 1.5 }) => ( 
  <svg {...scaleAttrs} className={className} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden={ariaHidden} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg 
    {...scaleAttrs}
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a4 4 0 110-8 4 4 0 010 8z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const TvIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const NotificationBellIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
    <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export const FolderPlusIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 15l7-7 7 7" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => ( 
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ClockFilledIcon: React.FC<IconProps> = ({ className, ariaHidden = true, fill="currentColor", strokeWidth = 1.5 }) => ( 
  <svg {...scaleAttrs} className={className} fill={fill} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden={ariaHidden} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg 
    {...scaleAttrs}
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden={ariaHidden}
  >
    <path d="M9 15L3 9L9 3M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

export const PlayCircleIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CollectionIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export const TrophyAwardIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg
    {...scaleAttrs}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={ariaHidden}
  >
    <path d="M7 21h10" /> {/* Base */}
    <path d="M12 21v-2" /> {/* Stem connecting to base */}
    {/* Elongated vase body: Start from top rim (Y=5), curve outwards then inwards to meet stem (Y=19) */}
    <path d="M8 5 C8 7.5 5.5 9.5 5.5 12 C5.5 14.5 8 16.5 12 19 C16 16.5 18.5 14.5 18.5 12 C18.5 9.5 16 7.5 16 5" /> 
    <path d="M8 5h8" /> {/* Top rim of the vase */}
    {/* Handles: Proportional, attached to the vase body */}
    <path d="M5.5 12 C3 12 2.5 9 5 8" /> {/* Left Handle: connects to the widest part of vase body */}
    <path d="M18.5 12 C21 12 21.5 9 19 8" /> {/* Right Handle: connects to the widest part of vase body */}
  </svg>
);

export const LockClosedIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const CheckCheckIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
    <svg {...scaleAttrs} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const UserSparklesIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" aria-hidden={ariaHidden} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0L16.5 15.75m-8.018 2.975L7.5 15.75m6 3V11.25m0 0L12 8.25m0 3L13.5 8.25m0 3L12 11.25m3-6.375L16.5 3.375m0 0L18 4.875m-1.5-1.5L15 4.875m-3-1.5V2.625m0 0L10.5 1.125m0 1.5L9 1.125m0 1.5V2.625m0 0L7.5 4.125M12 11.25l-1.5-1.5M12 11.25l1.5-1.5" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className, ariaHidden = true, strokeWidth = 1.5 }) => (
  <svg {...scaleAttrs} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden={ariaHidden} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);