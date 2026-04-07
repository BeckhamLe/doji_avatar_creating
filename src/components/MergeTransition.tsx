import { useEffect, useRef, useCallback } from 'react';
import { easeInOutCubic } from '../utils/animation';

export interface ShapeSnapshot {
  left: number;
  top: number;
  width: number;
  height: number;
  isCircle: boolean;
}

interface MergeTransitionProps {
  shapes: ShapeSnapshot[];
  onShapesClonesReady: () => void;
  onBlackScreenReady: () => void;
  onIrisComplete: () => void;
}

export function MergeTransition({ shapes, onShapesClonesReady, onBlackScreenReady, onIrisComplete }: MergeTransitionProps) {
  const mergeLayerRef = useRef<HTMLDivElement>(null);
  const irisLayerRef = useRef<HTMLDivElement>(null);
  const whiteBgRef = useRef<HTMLDivElement>(null);

  const CONVERGE_DURATION = 1000;
  const EXPAND_DURATION = 800;
  const IRIS_DURATION = 800;
  const PAUSE_ON_BLACK = 600;

  const runTransition = useCallback(() => {
    const mergeLayer = mergeLayerRef.current;
    if (!mergeLayer || shapes.length === 0) {
      onBlackScreenReady();
      onIrisComplete();
      return;
    }

    const phoneRect = mergeLayer.parentElement!.getBoundingClientRect();

    const centerX = phoneRect.width / 2;
    const centerY = phoneRect.height / 2;

    const blobSize = 50;
    const targetLeft = centerX - blobSize / 2;
    const targetTop = centerY - blobSize / 2;

    // Create clones at FINAL position (center), then use transform to place them at ORIGINAL position.
    // Animation lerps transform from offset → identity. This is GPU-composited (no layout reflow).
    const clones: HTMLDivElement[] = [];
    const offsets: { tx: number; ty: number; sx: number; sy: number; startRadius: number }[] = [];

    shapes.forEach((shape) => {
      const clone = document.createElement('div');
      clone.style.position = 'absolute';
      clone.style.overflow = 'hidden';
      clone.style.willChange = 'transform';
      // Set at final blob position/size
      clone.style.left = targetLeft + 'px';
      clone.style.top = targetTop + 'px';
      clone.style.width = blobSize + 'px';
      clone.style.height = blobSize + 'px';
      clone.style.background = '#080808';

      // Calculate transform to position at original location
      const tx = shape.left - targetLeft;
      const ty = shape.top - targetTop;
      const sx = shape.width / blobSize;
      const sy = shape.height / blobSize;
      const startRadius = shape.isCircle ? 50 : 12;

      clone.style.borderRadius = startRadius + '%';
      clone.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
      clone.style.transformOrigin = '0 0';

      mergeLayer.appendChild(clone);
      clones.push(clone);
      offsets.push({ tx, ty, sx, sy, startRadius });
    });

    if (whiteBgRef.current) whiteBgRef.current.style.display = 'block';

    // Phase 1: Converge — animate transforms from offset to identity
    const mergeStartTime = performance.now();

    function animateConverge(timestamp: number) {
      const elapsed = timestamp - mergeStartTime;
      const t = Math.min(elapsed / CONVERGE_DURATION, 1);
      const easedT = easeInOutCubic(t);

      clones.forEach((c, i) => {
        const o = offsets[i];
        const currentTx = o.tx * (1 - easedT);
        const currentTy = o.ty * (1 - easedT);
        const currentSx = o.sx + (1 - o.sx) * easedT;
        const currentSy = o.sy + (1 - o.sy) * easedT;
        c.style.transform = `translate(${currentTx}px, ${currentTy}px) scale(${currentSx}, ${currentSy})`;
        c.style.borderRadius = (o.startRadius + (50 - o.startRadius) * easedT) + '%';
      });

      if (t < 1) {
        requestAnimationFrame(animateConverge);
      } else {
        // Phase 2: Single blob expands to fill screen
        mergeLayer!.innerHTML = '';
        const blob = document.createElement('div');
        blob.style.position = 'absolute';
        blob.style.background = '#080808';
        blob.style.borderRadius = '50%';
        blob.style.willChange = 'transform';
        blob.style.left = targetLeft + 'px';
        blob.style.top = targetTop + 'px';
        blob.style.width = blobSize + 'px';
        blob.style.height = blobSize + 'px';
        mergeLayer!.appendChild(blob);

        requestAnimationFrame(() => {
          const maxDim = Math.max(phoneRect.width, phoneRect.height);
          const maxScale = (maxDim / blobSize) * 2.5;

          blob.style.transition = `transform ${EXPAND_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1), border-radius ${EXPAND_DURATION}ms ease`;
          blob.style.transform = `scale(${maxScale})`;
          blob.style.borderRadius = '0';

          setTimeout(() => {
            onShapesClonesReady();
            onBlackScreenReady();

            setTimeout(() => {
              // Phase 3: Iris retraction
              mergeLayer!.style.display = 'none';
              if (whiteBgRef.current) whiteBgRef.current.style.display = 'none';

              const irisLayer = irisLayerRef.current;
              if (!irisLayer) { onIrisComplete(); return; }

              irisLayer.style.display = 'block';
              irisLayer.innerHTML = '';

              const irisBlob = document.createElement('div');
              irisBlob.style.position = 'absolute';
              irisBlob.style.background = '#080808';
              irisBlob.style.borderRadius = '0';
              irisBlob.style.willChange = 'transform';
              irisBlob.style.left = (centerX - blobSize / 2) + 'px';
              irisBlob.style.top = (centerY - blobSize / 2) + 'px';
              irisBlob.style.width = blobSize + 'px';
              irisBlob.style.height = blobSize + 'px';
              irisBlob.style.transform = `scale(${maxScale})`;
              irisLayer.appendChild(irisBlob);

              setTimeout(() => {
                irisBlob.style.transition = `transform ${IRIS_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1), border-radius ${IRIS_DURATION}ms ease, opacity ${IRIS_DURATION * 0.3}ms ease ${IRIS_DURATION * 0.7}ms`;
                irisBlob.style.transform = 'scale(0)';
                irisBlob.style.borderRadius = '50%';
                irisBlob.style.opacity = '0';

                setTimeout(() => {
                  irisLayer.style.display = 'none';
                  onIrisComplete();
                }, IRIS_DURATION);
              }, 50);

            }, PAUSE_ON_BLACK);

          }, EXPAND_DURATION - 30);
        });
      }
    }

    requestAnimationFrame(animateConverge);
  }, [shapes, onBlackScreenReady, onIrisComplete, onShapesClonesReady, CONVERGE_DURATION, EXPAND_DURATION, IRIS_DURATION, PAUSE_ON_BLACK]);

  useEffect(() => {
    const timer = setTimeout(() => runTransition(), 550);
    return () => clearTimeout(timer);
  }, [runTransition]);

  return (
    <>
      <div
        ref={whiteBgRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 23,
          background: '#fff',
          pointerEvents: 'none',
          display: 'none',
        }}
      />
      <div
        ref={mergeLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          pointerEvents: 'none',
        }}
      />
      <div
        ref={irisLayerRef}
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
