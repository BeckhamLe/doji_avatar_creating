import { useEffect, useRef, useCallback } from 'react';

export interface ShapeSnapshot {
  left: number;
  top: number;
  width: number;
  height: number;
  isCircle: boolean;
}

interface MergeTransitionProps {
  shapes: ShapeSnapshot[];
  onShapesClonesReady: () => void; // called after clones are in position — parent should hide PicSelectionScreen
  onBlackScreenReady: () => void;  // called when screen is fully black — parent should show loading screen (zoomed in)
  onIrisComplete: () => void;      // called after iris retraction finishes — parent should start zoom out
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function MergeTransition({ shapes, onShapesClonesReady, onBlackScreenReady, onIrisComplete }: MergeTransitionProps) {
  const mergeLayerRef = useRef<HTMLDivElement>(null);
  const irisLayerRef = useRef<HTMLDivElement>(null);
  const whiteBgRef = useRef<HTMLDivElement>(null);

  // ---- TIMING (slowed down) ----
  const CONVERGE_DURATION = 1000;
  const EXPAND_DURATION = 800;
  const IRIS_DURATION = 800;
  const PAUSE_ON_BLACK = 600; // hold on black — gives loading screen time to initialize zoom state

  const runTransition = useCallback(() => {
    const mergeLayer = mergeLayerRef.current;
    if (!mergeLayer || shapes.length === 0) {
      onBlackScreenReady();
      onIrisComplete();
      return;
    }

    const phoneRect = mergeLayer.parentElement?.getBoundingClientRect();
    if (!phoneRect) return;

    const centerX = phoneRect.width / 2;
    const centerY = phoneRect.height / 2;

    // Create black shape clones from snapshot data
    const clones: HTMLDivElement[] = [];
    shapes.forEach((shape) => {
      const clone = document.createElement('div');
      clone.style.position = 'absolute';
      clone.style.overflow = 'hidden';
      clone.style.willChange = 'transform, opacity';
      clone.style.width = shape.width + 'px';
      clone.style.height = shape.height + 'px';
      clone.style.left = shape.left + 'px';
      clone.style.top = shape.top + 'px';
      clone.style.background = '#080808';
      clone.style.borderRadius = shape.isCircle ? '50%' : '12px';
      clone.style.opacity = '1';

      mergeLayer.appendChild(clone);
      clones.push(clone);
    });

    const originals = shapes.map(s => ({
      left: s.left, top: s.top, width: s.width, height: s.height,
    }));

    // Show white bg to cover PicSelectionScreen — clones on top of white bg match the look
    if (whiteBgRef.current) whiteBgRef.current.style.display = 'block';

    const blobSize = 50;
    const targetLeft = centerX - blobSize / 2;
    const targetTop = centerY - blobSize / 2;

    // Phase 1: Converge shapes to center
    const mergeStartTime = performance.now();

    function animateConverge(timestamp: number) {
      const elapsed = timestamp - mergeStartTime;
      const t = Math.min(elapsed / CONVERGE_DURATION, 1);
      const easedT = easeInOutCubic(t);

      clones.forEach((c, i) => {
        const o = originals[i];
        const startRadius = shapes[i].isCircle ? 50 : 12;
        c.style.left = (o.left + (targetLeft - o.left) * easedT) + 'px';
        c.style.top = (o.top + (targetTop - o.top) * easedT) + 'px';
        c.style.width = (o.width + (blobSize - o.width) * easedT) + 'px';
        c.style.height = (o.height + (blobSize - o.height) * easedT) + 'px';
        // Lerp from starting radius to 50% (full circle for the blob)
        c.style.borderRadius = (startRadius + (50 - startRadius) * easedT) + '%';
      });

      if (t < 1) {
        requestAnimationFrame(animateConverge);
      } else {
        // Phase 2: Replace all shapes with single blob, expand to fill screen
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
          const maxDim = Math.max(window.innerWidth, window.innerHeight);
          const maxScale = (maxDim / blobSize) * 2.5;

          blob.style.transition = `transform ${EXPAND_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1), border-radius ${EXPAND_DURATION}ms ease`;
          blob.style.transform = `scale(${maxScale})`;
          blob.style.borderRadius = '0';

          setTimeout(() => {
            // Screen is fully black now — safe to unmount PicSelectionScreen and show loading screen
            onShapesClonesReady();
            onBlackScreenReady();

            // Brief hold on black
            setTimeout(() => {
              // Phase 3: Iris retraction — shrink blob from edges to center
              mergeLayer!.style.display = 'none';
              // Hide the white background so iris reveals the loading screen behind
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
  }, [shapes, onBlackScreenReady, onIrisComplete, CONVERGE_DURATION, EXPAND_DURATION, IRIS_DURATION, PAUSE_ON_BLACK]);

  useEffect(() => {
    // Wait for the fade-to-black on PicSelectionScreen to complete (0.5s transition)
    const timer = setTimeout(() => runTransition(), 550);
    return () => clearTimeout(timer);
  }, [runTransition]);

  return (
    <>
      {/* White background — hidden initially, shown when clones are ready (covers PicSelection), hidden before iris */}
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
      {/* Merge layer — shapes converge and blob expands */}
      <div
        ref={mergeLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          pointerEvents: 'none',
        }}
      />
      {/* Iris layer — blob shrinks back to center */}
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
