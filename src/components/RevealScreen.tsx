import { motion } from 'framer-motion';
import { HeartIcon, ShareIcon, MoreDotsIcon } from './Icons';
import { EASE } from '../constants/animation';

interface RevealScreenProps {
  onClose: () => void;
  onEnter?: () => void;
}

export function RevealScreen({ onClose, onEnter }: RevealScreenProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#FFFFFF',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Back button */}
      <motion.button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* Avatar image — fills the screen edge-to-edge */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <img
          src="/images/profile/look_1.jpg"
          alt="Your avatar look"
          style={{
            width: '85%',
            height: '92%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            marginBottom: 4,
          }}
        />

        {/* Right side action icons — matches ProductDetailView */}
        <div
          style={{
            position: 'absolute',
            right: 16,
            bottom: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <HeartIcon />
          <ShareIcon />
          <MoreDotsIcon />
        </div>
      </div>

      {/* Bottom section — text block left, pill button right */}
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 36,
          paddingTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Text block — both lines together, no gap */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
          }}
        >
          <span style={{ fontSize: 11, color: '#999', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>humbeck</span>{' '}
            styled by{' '}
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>otniel</span> in
          </span>
          <br />
          <span style={{ fontSize: 12, color: '#1a1a1a', fontWeight: 400, lineHeight: 1.4 }}>
            Ferragamo Coat, Lu'u Dan Pants and
          </span>
        </div>

        {/* Enter button pill */}
        <motion.button
          onClick={onEnter}
          style={{
            paddingLeft: 22,
            paddingRight: 22,
            height: 44,
            borderRadius: 9999,
            background: '#1a1a1a',
            color: '#FFFFFF',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600,
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            cursor: 'pointer',
            border: 'none',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
          whileTap={{ scale: 0.97 }}
        >
          Enter
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7H12"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M8 3L12 7L8 11"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
