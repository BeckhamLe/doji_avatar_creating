import { useEffect, useRef, useCallback } from 'react';
import { waitForPaint } from '../utils/animation';

export interface BlobRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface BlobTransitionProps {
  /** Position of the pupil within the phone shell (where the blob expands FROM) */
  pupilRect: BlobRect;
  /** Called right before retraction to measure the target position. Return null to retract to center. */
  measureTarget: () => BlobRect | null;
  /** Called when screen is fully black — parent should mount the destination screen */
  onBlackScreen: () => void;
  /** Called when retraction is complete */
  onComplete: () => void;
}

export function BlobTransition({ pupilRect, measureTarget, onBlackScreen, onComplete }: BlobTransitionProps) {
  const expandLayerRef = useRef<HTMLDivElement>(null);
  const retractLayerRef = useRef<HTMLDivElement>(null);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  const EXPAND_DURATION = 1400; // Long enough to see blob grow from pupil to full screen
  const PAUSE_ON_BLACK = 600;
  const RETRACT_DURATION = 600;

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      if (!mountedRef.current) return;
      fn();
    }, delay);
    timerIds.current.push(id);
    return id;
  }, []);

  const run = useCallback(() => {
    const expandLayer = expandLayerRef.current;
    if (!expandLayer) { onBlackScreen(); onComplete(); return; }

    const phoneRect = expandLayer.parentElement!.getBoundingClientRect();
    const blobSize = 50;

    const pupilCenterX = pupilRect.left + pupilRect.width / 2;
    const pupilCenterY = pupilRect.top + pupilRect.height / 2;
    const blobLeft = pupilCenterX - blobSize / 2;
    const blobTop = pupilCenterY - blobSize / 2;

    const blob = document.createElement('div');
    blob.style.position = 'absolute';
    blob.style.background = '#080808';
    blob.style.borderRadius = '50%';
    blob.style.willChange = 'transform';
    blob.style.left = blobLeft + 'px';
    blob.style.top = blobTop + 'px';
    blob.style.width = blobSize + 'px';
    blob.style.height = blobSize + 'px';
    // Start tiny but visible — a small dark circle at the pupil
    const startScale = Math.max(pupilRect.width, pupilRect.height) / blobSize;
    blob.style.transform = `scale(${startScale})`;
    expandLayer.appendChild(blob);

    const maxDim = Math.max(phoneRect.width, phoneRect.height);
    const maxScale = (maxDim / blobSize) * 2.5;

    // Ensure the browser paints the initial scale before we start the transition
    waitForPaint(() => {
      if (!mountedRef.current) return;
      blob.style.transition = `transform ${EXPAND_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), border-radius ${EXPAND_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      blob.style.transform = `scale(${maxScale})`;
      blob.style.borderRadius = '0';
    });

    // Listen for expand transition completion
    {
      const onExpandDone = () => {
        blob.removeEventListener('transitionend', onExpandDone);
        if (!mountedRef.current) return;

        // Screen is fully black — mount destination screen
        onBlackScreen();

        addTimer(() => {
          const retractLayer = retractLayerRef.current;
          if (!retractLayer) { onComplete(); return; }

          retractLayer.style.display = 'block';
          retractLayer.innerHTML = '';

          // Measure target NOW (quiz is mounted and entrance animation done)
          const tgt = measureTarget() || {
            left: phoneRect.width / 2 - 4,
            top: phoneRect.height / 2 - 4,
            width: 8,
            height: 8,
          };

          const tgtCenterX = tgt.left + tgt.width / 2;
          const tgtCenterY = tgt.top + tgt.height / 2;
          const retractBlobLeft = tgtCenterX - blobSize / 2;
          const retractBlobTop = tgtCenterY - blobSize / 2;

          const retractBlob = document.createElement('div');
          retractBlob.style.position = 'absolute';
          retractBlob.style.background = '#080808';
          retractBlob.style.borderRadius = '0';
          retractBlob.style.willChange = 'transform';
          retractBlob.style.left = retractBlobLeft + 'px';
          retractBlob.style.top = retractBlobTop + 'px';
          retractBlob.style.width = blobSize + 'px';
          retractBlob.style.height = blobSize + 'px';
          retractBlob.style.transform = `scale(${maxScale})`;
          retractLayer.appendChild(retractBlob);

          const targetScale = Math.max(tgt.width, tgt.height) / blobSize;

          // Wait for retract layer to paint before hiding expand layer (prevents white flash)
          waitForPaint(() => {
              if (!mountedRef.current) return;
              expandLayer.style.display = 'none';

              // Start retraction
              addTimer(() => {
                retractBlob.style.transition = `transform ${RETRACT_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1), border-radius ${RETRACT_DURATION}ms ease, opacity ${RETRACT_DURATION * 0.3}ms ease ${RETRACT_DURATION * 0.7}ms`;
                retractBlob.style.transform = `scale(${targetScale})`;
                retractBlob.style.borderRadius = '50%';
                retractBlob.style.opacity = '0';

                addTimer(() => {
                  retractLayer.style.display = 'none';
                  onComplete();
                }, RETRACT_DURATION);
              }, 30);
          });
        }, PAUSE_ON_BLACK);
      };

      // Only listen for the transform transition (not border-radius)
      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return;
        blob.removeEventListener('transitionend', onTransitionEnd);
        onExpandDone();
      };
      blob.addEventListener('transitionend', onTransitionEnd);

      // Fallback: if transitionend doesn't fire (mobile tab backgrounded), use setTimeout
      addTimer(() => {
        blob.removeEventListener('transitionend', onTransitionEnd);
        onExpandDone();
      }, EXPAND_DURATION + 200);
    }
  }, [pupilRect, measureTarget, onBlackScreen, onComplete, addTimer]);

  useEffect(() => {
    mountedRef.current = true;
    const timer = setTimeout(run, 16);
    timerIds.current.push(timer);

    // Clean up all timers on unmount
    return () => {
      mountedRef.current = false;
      timerIds.current.forEach(id => clearTimeout(id));
      timerIds.current = [];
    };
  }, [run]);

  return (
    <>
      <div
        ref={expandLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          pointerEvents: 'none',
        }}
      />
      <div
        ref={retractLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 24,
          pointerEvents: 'none',
          display: 'none',
        }}
      />
    </>
  );
}
