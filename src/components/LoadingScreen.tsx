import { useRef, useEffect, useLayoutEffect, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FaceContainer } from './FaceContainer';
import type { FaceContainerHandle } from './FaceContainer';
import { calculatePupilPosition } from '../utils/pupilMath';

export interface LoadingScreenHandle {
  unlockVideos: () => void;
}

interface LoadingScreenProps {
  progress: number;
  isZoomedIn: boolean;
  faceActive: boolean;
  avatarReady?: boolean;
  zoomConfig: {
    pupilX: number;
    pupilY: number;
    zoomStart: number;
    zoomDuration: number;
  };
  onZoomComplete: () => void;
  onDiscoverStyle: () => void;
  onExploreLooks: () => void;
  onReveal?: () => void;
}

export const LoadingScreen = forwardRef<LoadingScreenHandle, LoadingScreenProps>(function LoadingScreen({
  progress,
  isZoomedIn,
  faceActive,
  avatarReady,
  zoomConfig,
  onZoomComplete,
  onDiscoverStyle,
  onExploreLooks,
  onReveal,
}, ref) {
  const innerRef = useRef<HTMLDivElement>(null);
  const faceContainerRef = useRef<FaceContainerHandle>(null);
  const hasZoomedOut = useRef(false);

  useImperativeHandle(ref, () => ({
    unlockVideos: () => faceContainerRef.current?.unlockVideos(),
  }));

  // Apply initial zoom transform synchronously before first paint
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const vpW = el.parentElement?.clientWidth || window.innerWidth;
    const vpH = el.parentElement?.clientHeight || window.innerHeight;
    const { originX, originY } = calculatePupilPosition(vpW, vpH, zoomConfig.pupilX, zoomConfig.pupilY);

    el.style.transformOrigin = `${originX}% ${originY}%`;
    el.style.transform = `scale(${zoomConfig.zoomStart})`;
  }, [zoomConfig]);

  // Trigger zoom out
  useEffect(() => {
    if (isZoomedIn || hasZoomedOut.current) return;
    const el = innerRef.current;
    if (!el) return;

    hasZoomedOut.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${zoomConfig.zoomDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.transform = 'scale(1)';

        setTimeout(onZoomComplete, zoomConfig.zoomDuration);
      });
    });
  }, [isZoomedIn, zoomConfig.zoomDuration, onZoomComplete]);

  return (
    <div
      ref={innerRef}
      className="absolute inset-0 bg-white"
      style={{ zIndex: 10 }}
    >
      {/* Centered content */}
      <div className="loading-content-inner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center gap-7">
        {/* Percentage */}
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 42,
            fontWeight: 400,
            color: '#1a1a1a',
            letterSpacing: 2,
            lineHeight: 1,
            textAlign: 'center',
            position: 'relative',
            left: 10,
          }}
        >
          {progress}%
        </div>

        {/* Face container */}
        <FaceContainer ref={faceContainerRef} isActive={faceActive} />

        {/* Text below face */}
        <div className="text-center">
          <h1 className="font-serif text-[22px] font-normal text-text-primary">
            Creating your likeness
          </h1>
          <p className="text-[13px] text-[#aaa] mt-1.5 leading-relaxed">
            This usually takes about 30 minutes.
          </p>
        </div>
      </div>

      {/* Bottom panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          background: '#fff',
          borderTop: '1px solid #ebebeb',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div className="w-9 h-1 bg-[#d4d4d4] rounded-[2px]" />
        <p className="text-[13px] text-text-secondary text-center leading-relaxed mb-0.5">
          {avatarReady
            ? 'Your likeness is ready.'
            : <>In the meantime, discover your style or explore looks.<br />We'll let you know when it's ready.</>
          }
        </p>
        <div className="flex flex-col gap-3 w-full">
          {avatarReady && (
            <motion.button
              onClick={onReveal}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full h-[52px] rounded-[26px] flex items-center justify-center text-sm font-semibold font-serif bg-text-primary text-white cursor-pointer border-none"
              whileTap={{ scale: 0.97 }}
            >
              Reveal Your Avatar
            </motion.button>
          )}
          <div className="flex gap-3 w-full">
            <motion.button
              onClick={onDiscoverStyle}
              className="flex-1 h-[52px] rounded-[26px] flex items-center justify-center text-sm font-semibold font-serif cursor-pointer"
              style={{
                background: avatarReady ? '#fff' : '#1a1a1a',
                color: avatarReady ? '#1a1a1a' : '#fff',
                border: avatarReady ? '1.5px solid #d4d4d4' : 'none',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Discover Your Style
            </motion.button>
            <motion.button
              onClick={onExploreLooks}
              className="flex-1 h-[52px] rounded-[26px] flex items-center justify-center text-sm font-semibold font-serif bg-white text-text-primary border-[1.5px] border-[#d4d4d4] cursor-pointer"
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Explore Looks
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
});
