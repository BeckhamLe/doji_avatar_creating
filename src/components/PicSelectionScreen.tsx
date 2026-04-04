import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "../constants/animation";

interface PicSelectionScreenProps {
  onCreateLikeness: () => void;
  isFading?: boolean;
}

const selfieImages = [
  { src: "/images/selfies/selfie_1.jpg", position: "center 40%", scale: "112%" },
  { src: "/images/selfies/selfie_2.jpg", position: "center 52%", scale: "100%" },
  { src: "/images/selfies/selfie_3.jpg", position: "center 54%", scale: "100%" },
  { src: "/images/selfies/selfie_4.jpg", position: "center 42%", scale: "108%" },
  { src: "/images/selfies/selfie_5.jpg", position: "center 44%", scale: "108%" },
  { src: "/images/selfies/selfie_6.jpg", position: "center 40%", scale: "112%" },
];

const bodyImages = [
  { src: "/images/selfies/body_1.jpg", position: "50% 45%", scale: "130%" },
  { src: "/images/selfies/body_2.jpg", position: "50% 45%", scale: "130%" },
];

const SELFIE_ROWS = [selfieImages.slice(0, 3), selfieImages.slice(3, 6)];
const FADE_OUT = { duration: 0.25, ease: EASE } as const;
const FADE_DUR = 0.55;

function RemoveBadge({ fading, onClick, delay }: { fading?: boolean; onClick: () => void; delay: number }) {
  return (
    <motion.button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: fading ? 0 : 1, scale: fading ? 0.8 : 1 }}
      transition={fading ? FADE_OUT : { delay: delay + 0.1, duration: 0.3, ease: EASE }}
      style={{
        position: 'absolute',
        top: -6,
        right: -6,
        zIndex: 10,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.65)",
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 2L8 8M8 2L2 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}

export function PicSelectionScreen({ onCreateLikeness, isFading }: PicSelectionScreenProps) {
  const [removedSelfies, setRemovedSelfies] = useState<Set<number>>(new Set());
  const [removedBodies, setRemovedBodies] = useState<Set<number>>(new Set());

  const toggleSelfie = (i: number) => {
    setRemovedSelfies(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const toggleBody = (i: number) => {
    setRemovedBodies(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        transition={isFading ? FADE_OUT : { delay: 0.1, duration: FADE_DUR, ease: EASE }}
        style={{ width: 36, height: 5, background: "#d4d4d4", borderRadius: 3, marginTop: 14 }}
      />

      <motion.div
        className="flex w-full items-center justify-between"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: isFading ? 0 : 1, y: 0 }}
        transition={isFading ? FADE_OUT : { delay: 0.18, duration: FADE_DUR, ease: EASE }}
        style={{ padding: '12px 20px 0' }}
      >
        <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#1a1a1a', cursor: 'pointer', lineHeight: 1 }}>
          &#8249;
        </button>
        <div
          style={{
            width: 24, height: 24, borderRadius: '50%',
            border: '1.5px solid #ccc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#999',
          }}
        >
          ?
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isFading ? 0 : 1, y: 0 }}
        transition={isFading ? FADE_OUT : { delay: 0.26, duration: FADE_DUR, ease: EASE }}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 26,
          fontWeight: 400,
          color: '#1a1a1a',
          marginTop: 28,
          textAlign: 'center',
        }}
      >
        Review your images
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isFading ? 0 : 1, y: 0 }}
        transition={isFading ? FADE_OUT : { delay: 0.34, duration: FADE_DUR, ease: EASE }}
        style={{
          fontSize: 15,
          color: '#999',
          textAlign: 'center',
          marginTop: 10,
          lineHeight: 1.5,
          padding: '0 50px',
        }}
      >
        Give your images a final check before creating your likeness
      </motion.p>

      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {SELFIE_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
            {row.map((img, j) => {
              const i = rowIndex * 3 + j;
              const delay = 0.42 + i * 0.06;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay, duration: FADE_DUR, ease: EASE }}
                  style={{ position: 'relative', width: 95, height: 95 }}
                >
                  <div
                    data-merge={i}
                    className="selfie-circle"
                    style={{
                      width: 95, height: 95, borderRadius: '50%',
                      overflow: 'hidden', position: 'relative',
                      background: isFading ? '#080808' : '#e5e5e5',
                      transition: 'background 0.5s ease',
                    }}
                  >
                    {!removedSelfies.has(i) && (
                      <img
                        src={img.src}
                        alt={`Selfie ${i + 1}`}
                        style={{
                          width: img.scale,
                          height: img.scale,
                          objectFit: 'cover',
                          objectPosition: img.position,
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          opacity: isFading ? 0 : 1,
                          transition: 'opacity 0.25s ease',
                        }}
                      />
                    )}
                  </div>
                  <RemoveBadge fading={isFading} onClick={() => toggleSelfie(i)} delay={delay} />
                </motion.div>
              );
            })}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          {bodyImages.map((img, i) => {
            const delay = 0.78 + i * 0.06;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay, duration: FADE_DUR, ease: EASE }}
                style={{ position: 'relative', width: 150, height: 200 }}
              >
                <div
                  data-merge={i + 6}
                  className="body-rect"
                  style={{
                    width: 150, height: 200, borderRadius: 12,
                    overflow: 'hidden', position: 'relative',
                    background: isFading ? '#080808' : '#e5e5e5',
                    transition: 'background 0.5s ease',
                  }}
                >
                  {!removedBodies.has(i) && (
                    <img
                      src={img.src}
                      alt={`Full body ${i + 1}`}
                      loading="lazy"
                      style={{
                        width: img.scale,
                        height: img.scale,
                        objectFit: 'cover',
                        objectPosition: img.position,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: isFading ? 0 : 1,
                        transition: 'opacity 0.25s ease',
                      }}
                    />
                  )}
                </div>
                <RemoveBadge fading={isFading} onClick={() => toggleBody(i)} delay={delay} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* flex: 1 + negative margin centers button between grid bottom and screen bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isFading ? 0 : 1, y: 0 }}
        transition={isFading ? FADE_OUT : { delay: 0.9, duration: FADE_DUR, ease: EASE }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -15,
          pointerEvents: isFading ? 'none' as const : 'auto' as const,
        }}
      >
        <motion.button
          style={{
            paddingLeft: 32,
            paddingRight: 32,
            height: 52,
            borderRadius: 26,
            background: '#1a1a1a',
            color: '#fff',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateLikeness}
        >
          Create Likeness
        </motion.button>
      </motion.div>
    </div>
  );
}
