interface IconProps {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  style?: React.CSSProperties;
}

export function HeartIcon({ size = 24, stroke = '#1a1a1a', strokeWidth = 1.5, fill = 'none' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function ShareIcon({ size = 24, stroke = '#1a1a1a', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export function MoreDotsIcon({ size = 24, stroke = '#1a1a1a', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

export function BackChevron({ size = 20, stroke = '#1a1a1a', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M13 4L7 10L13 16" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ size = 10, stroke = '#1a1a1a', strokeWidth = 1.5 }: IconProps) {
  const isLarge = size >= 16;
  return (
    <svg width={size} height={size} viewBox={isLarge ? '0 0 16 16' : '0 0 10 10'} fill="none">
      <path d={isLarge ? 'M2 2L14 14M14 2L2 14' : 'M2 2L8 8M8 2L2 8'} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ size = 16, stroke = '#999', strokeWidth = 1.2, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <circle cx="7" cy="7" r="5.5" stroke={stroke} strokeWidth={strokeWidth} />
      <path d="M11 11L14 14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
