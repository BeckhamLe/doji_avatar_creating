import { motion } from 'framer-motion';

interface ProgressThumbnailProps {
  progress: number;
  onClick: () => void;
}

export function ProgressThumbnail({ progress, onClick }: ProgressThumbnailProps) {
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.button
      onClick={onClick}
      className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer bg-transparent border-none p-0"
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-[#eaeaea]" />

      {/* Progress ring SVG */}
      <svg
        className="absolute inset-0 -rotate-90"
        width="44"
        height="44"
        viewBox="0 0 44 44"
      >
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#ececec"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#d0d5ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>

      {/* Tiny figure placeholder */}
      <div className="relative flex flex-col items-center gap-[1px]">
        <div className="w-[10px] h-[10px] rounded-full bg-[#bbbbbe]" />
        <div className="w-[6px] h-[13px] rounded-[3px] bg-[#bbbbbe]" />
      </div>
    </motion.button>
  );
}
