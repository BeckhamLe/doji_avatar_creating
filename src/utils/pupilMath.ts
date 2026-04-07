/** Calculate pupil position within a viewport, given face container layout constants */
export function calculatePupilPosition(
  vpW: number,
  vpH: number,
  pupilX: number,
  pupilY: number,
): { x: number; y: number; originX: number; originY: number } {
  const contentTopY = vpH * 0.5 - (488 * 0.6);
  const faceTopY = contentTopY + 42 + 28;
  const faceCenterX = vpW / 2;

  const x = faceCenterX - 130 + (260 * pupilX);
  const y = faceTopY + (340 * pupilY);

  return {
    x,
    y,
    originX: (x / vpW) * 100,
    originY: (y / vpH) * 100,
  };
}
