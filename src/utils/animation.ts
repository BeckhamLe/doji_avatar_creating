/** Shared easing function — used by MergeTransition and FaceContainer */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Set clip-path with WebKit fallback */
export function setClipPath(el: HTMLElement, value: string): void {
  el.style.clipPath = value;
  (el.style as unknown as Record<string, string>).webkitClipPath = value;
}

/**
 * Wait for the browser to paint the current state before calling fn.
 * Double RAF guarantees the initial state is committed to a rendered frame.
 */
export function waitForPaint(fn: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}
