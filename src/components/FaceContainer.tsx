import { forwardRef, useEffect, useRef, useCallback } from 'react';

interface FaceContainerProps {
  isActive: boolean;
}

export const FaceContainer = forwardRef<HTMLDivElement, FaceContainerProps>(({ isActive }, ref) => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const scanBarRef = useRef<HTMLDivElement>(null);
  const gridTextRefs = useRef<(SVGTextElement | null)[]>([null, null, null, null]);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const directionRef = useRef<'down' | 'up'>('down');
  const activeVideoRef = useRef<1 | 2>(1);

  const easeInOutCubic = useCallback((t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  const randomCoord = useCallback(() => {
    return `${(Math.random() * 360 - 180).toFixed(1)}°`;
  }, []);

  const updateGridText = useCallback(() => {
    gridTextRefs.current.forEach((el) => {
      if (el) el.textContent = randomCoord();
    });
  }, [randomCoord]);

  const performWipe = useCallback(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    const scanBar = scanBarRef.current;
    if (!video1 || !video2 || !scanBar) return;

    const topVideo = activeVideoRef.current === 1 ? video2 : video1;
    const bottomVideo = activeVideoRef.current === 1 ? video1 : video2;

    // Ensure top video is playing and on top
    topVideo.style.zIndex = '1';
    bottomVideo.style.zIndex = '0';
    topVideo.currentTime = 0;
    topVideo.play();

    const direction = directionRef.current;
    const duration = 7000;
    let startTime: number | null = null;

    scanBar.style.opacity = '1';

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeInOutCubic(rawProgress);

      const barTop = direction === 'down'
        ? progress * 340 - 10
        : 340 - progress * 340 - 10;

      scanBar.style.top = `${barTop}px`;

      // Reveal clip via clip-path
      if (direction === 'down') {
        topVideo.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
      } else {
        topVideo.style.clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
      }

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Wipe complete
        scanBar.style.opacity = '0';
        scanBar.style.top = '-10px';

        // Pause and reset the old video
        bottomVideo.pause();
        bottomVideo.currentTime = 0;

        // Reset clip path — top video is now fully revealed
        topVideo.style.clipPath = 'none';

        // Swap roles
        activeVideoRef.current = activeVideoRef.current === 1 ? 2 : 1;

        // Flip direction
        directionRef.current = direction === 'down' ? 'up' : 'down';

        // Update grid text
        updateGridText();

        // Schedule next wipe
        const nextDelay = 5000 + Math.random() * 5000;
        timeoutRef.current = setTimeout(performWipe, nextDelay);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [easeInOutCubic, updateGridText]);

  useEffect(() => {
    if (!isActive) return;

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    if (!video1 || !video2) return;

    // Start both videos
    video1.play();
    video2.play();

    // Video 2 starts clipped
    video2.style.clipPath = 'inset(0 0 100% 0)';
    video2.style.zIndex = '1';
    video1.style.zIndex = '0';

    // Initialize grid text
    updateGridText();

    // Schedule first wipe
    const firstDelay = 5000 + Math.random() * 5000;
    timeoutRef.current = setTimeout(performWipe, firstDelay);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, performWipe, updateGridText]);

  return (
    <div
      ref={ref}
      style={{
        width: 260,
        height: 340,
        borderRadius: 6,
        overflow: 'hidden',
        background: '#000',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes scanLinesMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        @keyframes gridPulse {
          0% { opacity: 0.12; }
          100% { opacity: 0.25; }
        }
      `}</style>

      {/* Video 1 */}
      <video
        ref={video1Ref}
        src="/clips/clip1.mp4"
        muted
        playsInline
        preload="auto"
        loop
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Video 2 */}
      <video
        ref={video2Ref}
        src="/clips/clip2.mp4"
        muted
        playsInline
        preload="auto"
        loop
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: 'inset(0 0 100% 0)',
        }}
      />

      {/* Scan overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Scan lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
            animation: 'scanLinesMove 8s linear infinite',
          }}
        />

        {/* Scan bar */}
        <div
          ref={scanBarRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 3,
            zIndex: 3,
            top: -10,
            opacity: 0,
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
            boxShadow: '0 0 12px 4px rgba(255,255,255,0.15)',
          }}
        />

        {/* Grid overlay SVG */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
            animation: 'gridPulse 4s ease-in-out infinite alternate',
          }}
          viewBox="0 0 260 340"
        >
          {/* Center vertical */}
          <line x1="130" y1="0" x2="130" y2="340" stroke="#1a1a1a" strokeWidth="0.5" />
          {/* Center horizontal */}
          <line x1="0" y1="170" x2="260" y2="170" stroke="#1a1a1a" strokeWidth="0.5" />
          {/* Quadrant lines */}
          <line x1="65" y1="0" x2="65" y2="340" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="195" y1="0" x2="195" y2="340" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1="85" x2="260" y2="85" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1="255" x2="260" y2="255" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.4" />

          {/* Corner coordinate labels */}
          <text
            ref={(el) => { gridTextRefs.current[0] = el; }}
            x="8"
            y="16"
            fill="#1a1a1a"
            fontSize="7"
            fontFamily="monospace"
          >
            0.0°
          </text>
          <text
            ref={(el) => { gridTextRefs.current[1] = el; }}
            x="220"
            y="16"
            fill="#1a1a1a"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="end"
          >
            0.0°
          </text>
          <text
            ref={(el) => { gridTextRefs.current[2] = el; }}
            x="8"
            y="332"
            fill="#1a1a1a"
            fontSize="7"
            fontFamily="monospace"
          >
            0.0°
          </text>
          <text
            ref={(el) => { gridTextRefs.current[3] = el; }}
            x="220"
            y="332"
            fill="#1a1a1a"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="end"
          >
            0.0°
          </text>
        </svg>

        {/* Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.12) 100%)',
          }}
        />

        {/* Corner brackets */}
        {/* Top-left */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 16,
            height: 16,
            borderTop: '1px solid rgba(26,26,26,0.2)',
            borderLeft: '1px solid rgba(26,26,26,0.2)',
            zIndex: 6,
          }}
        />
        {/* Top-right */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderTop: '1px solid rgba(26,26,26,0.2)',
            borderRight: '1px solid rgba(26,26,26,0.2)',
            zIndex: 6,
          }}
        />
        {/* Bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            width: 16,
            height: 16,
            borderBottom: '1px solid rgba(26,26,26,0.2)',
            borderLeft: '1px solid rgba(26,26,26,0.2)',
            zIndex: 6,
          }}
        />
        {/* Bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 16,
            height: 16,
            borderBottom: '1px solid rgba(26,26,26,0.2)',
            borderRight: '1px solid rgba(26,26,26,0.2)',
            zIndex: 6,
          }}
        />
      </div>
    </div>
  );
});

FaceContainer.displayName = 'FaceContainer';
