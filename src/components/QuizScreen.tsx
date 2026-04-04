import { motion, AnimatePresence } from 'framer-motion';
import { QuizCard } from './QuizCard';
import { BackChevron } from './Icons';
import { EASE } from '../constants/animation';
import type { QuizQuestion, StyleProfile } from '../types';

interface QuizScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  question: QuizQuestion;
  answers: Record<number, string>;
  result: StyleProfile | null;
  isComplete: boolean;
  onAnswer: (questionId: number, answerId: string) => void;
  onBack: () => void;
  onExit: () => void;
  onExplore: () => void;
  onReset: () => void;
}

function PersonaIcon({ persona }: { persona: string }) {
  const s = { stroke: '#fff', strokeWidth: 1.5, fill: 'none' } as const;
  const name = persona.toLowerCase();

  if (name.includes('deconstructionist')) {
    // Scissors — cutting, deconstructing
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" {...s}>
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    );
  }

  if (name.includes('purist')) {
    // Minimal circle — purity, clean
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name.includes('remixer')) {
    // Lightning bolt — energy, remix
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes('storyteller')) {
    // Feather/quill — narrative, craft
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" {...s}>
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" />
      </svg>
    );
  }

  if (name.includes('functionalist')) {
    // Hexagon — technical, engineered
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" {...s}>
        <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  // Fallback — sparkle
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

export function QuizScreen({
  currentQuestion,
  totalQuestions,
  question,
  answers,
  result,
  isComplete,
  onAnswer,
  onBack,
  onExit,
  onExplore,
  onReset,
}: QuizScreenProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-white z-20 flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={(_e, info) => {
        if (info.offset.y > 120 || info.velocity.y > 500) {
          onExit();
        }
      }}
    >
      {/* Drag handle — tap or swipe down to dismiss */}
      <div
        onClick={onExit}
        style={{
          paddingTop: '12px',
          paddingBottom: '4px',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div style={{ width: '36px', height: '5px', background: '#d4d4d4', borderRadius: '3px' }} />
      </div>

      {/* Top bar */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '8px', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {/* Back arrow */}
        <motion.button
          onClick={currentQuestion === 0 && !isComplete ? onExit : onBack}
          style={{
            width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            opacity: (currentQuestion === 0 && !isComplete) || isComplete ? 0 : 1,
            pointerEvents: (currentQuestion === 0 && !isComplete) || isComplete ? 'none' as const : 'auto' as const,
          }}
          whileTap={{ scale: 0.9 }}
        >
          <BackChevron />
        </motion.button>

        {/* Progress dots */}
        {!isComplete && (
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: i <= currentQuestion ? '#1a1a1a' : '#e0e0e0',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        )}

        {/* Spacer to balance back arrow */}
        <div style={{ width: '44px', height: '44px' }} />
      </div>

      {/* Content — fills remaining space */}
      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }} className="hide-scrollbar">
        <AnimatePresence mode="wait">
          {isComplete && result ? (
            <motion.div
              key="result"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: '20px', position: 'relative' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Persona image — full bleed, fades seamlessly into white on all edges */}
              {result.image && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '340px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  borderRadius: '20px 20px 0 0',
                }}>
                  <img
                    src={result.image}
                    alt={result.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 25%',
                      display: 'block',
                      transform: 'scale(1.2)',
                      maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 45%, transparent 85%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 45%, transparent 85%)',
                    }}
                  />
                </div>
              )}
              {/* Spacer to push content below the image */}
              <div style={{ height: result.image ? '240px' : '0px', flexShrink: 0 }} />

              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', fontWeight: 400, color: '#1a1a1a', textAlign: 'center', marginBottom: '6px', position: 'relative', zIndex: 1 }}>
                {result.name}
              </h2>
              <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', lineHeight: 1.5, maxWidth: '280px', marginBottom: '20px' }}>
                {result.description}
              </p>

              {/* Brand recommendations */}
              <div style={{ width: '100%' }}>
                <p style={{ fontSize: '11px', color: '#bbb', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', textAlign: 'center' }}>
                  Brands for you
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.brands.map((brand) => (
                    <div key={brand} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f5f5f5', borderRadius: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1a1a1a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PersonaIcon persona={result.name} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{brand}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', width: '100%' }}>
                <motion.button
                  onClick={onReset}
                  style={{ flex: 1, height: '46px', borderRadius: '23px', background: 'transparent', color: '#1a1a1a', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #e0e0e0' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Retake Quiz
                </motion.button>
                <motion.button
                  onClick={onExplore}
                  style={{ flex: 1, height: '46px', borderRadius: '23px', background: '#1a1a1a', color: '#fff', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Looks
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={question.id}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: '8px', paddingBottom: '24px', minHeight: 0 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {/* Question text */}
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 400, color: '#1a1a1a', textAlign: 'center', marginBottom: '14px', lineHeight: 1.3, flexShrink: 0 }}>
                {question.question}
              </h2>

              {/* Answer cards — fill remaining space */}
              <div style={{
                display: (question.layout === 'four-image-only' || question.layout === 'four-image-grid') ? 'grid' : 'flex',
                flexDirection: 'column',
                gap: '8px',
                minHeight: 0,
                ...(question.layout === 'two-text' ? {
                  justifyContent: 'center',
                  maxWidth: '320px',
                  margin: '0 auto',
                  width: '100%',
                  flex: 'none',
                } : (question.layout === 'four-image-only' || question.layout === 'four-image-grid') ? {
                  flex: 1,
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                } : { flex: 1 }),
              }}>
                {question.options.map((option) => (
                  <QuizCard
                    key={option.id}
                    label={option.label}
                    sublabel={option.sublabel}
                    hasImage={option.hasImage}
                    image={option.image}
                    imagePosition={option.imagePosition}
                    isImageOnly={question.layout === 'four-image-only'}
                    isGridImage={question.layout === 'four-image-grid'}
                    layout={question.layout}
                    isSelected={answers[question.id] === option.id}
                    hasSelection={answers[question.id] !== undefined}
                    onClick={() => onAnswer(question.id, option.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
