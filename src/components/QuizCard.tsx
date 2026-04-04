import { motion } from 'framer-motion';

interface QuizCardProps {
  label: string;
  sublabel?: string;
  hasImage: boolean;
  image?: string;
  imagePosition?: string;
  isImageOnly?: boolean;
  isGridImage?: boolean;
  layout?: string;
  isSelected: boolean;
  hasSelection: boolean;
  onClick: () => void;
}

export function QuizCard({ label, sublabel, hasImage, image, imagePosition, isImageOnly, isGridImage, layout, isSelected, hasSelection, onClick }: QuizCardProps) {
  // Unselected cards dim when another card is selected
  const dimmed = hasSelection && !isSelected;

  // Image-only cards (Q6) — 2x2 grid, tall rectangles filling available space
  if (isImageOnly) {
    return (
      <motion.button
        onClick={onClick}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'pointer',
          padding: 0,
          background: '#e0e0e0',
          display: 'flex',
        }}
        animate={{
          scale: isSelected ? 1.03 : dimmed ? 0.97 : 1,
          opacity: dimmed ? 0.45 : 1,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {image ? (
          <img src={image} alt={label || 'Style option'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition || 'center center' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#999' }}>Image</span>
          </div>
        )}
        {/* Selection border overlay */}
        {isSelected && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '14px',
              border: '3px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
    );
  }

  // Grid image cards (Q2) — 2x2 grid with text overlay
  if (isGridImage) {
    return (
      <motion.button
        onClick={onClick}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'pointer',
          padding: 0,
          background: '#1a1a1a',
          display: 'flex',
        }}
        animate={{
          scale: isSelected ? 1.03 : dimmed ? 0.97 : 1,
          opacity: dimmed ? 0.45 : 1,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {image ? (
          <img src={image} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition || 'center center' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#bbb' }}>Image</span>
          </div>
        )}
        {/* Dark scrim at bottom for text */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 10px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{label}</p>
          {sublabel && (
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', marginTop: '2px', lineHeight: 1.2 }}>{sublabel}</p>
          )}
        </div>
        {/* Selection border overlay */}
        {isSelected && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '14px',
              border: '3px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
    );
  }

  // Image cards (Q3-Q4) — stacked, image fills card, text at bottom over dark scrim
  if (hasImage) {
    return (
      <motion.button
        onClick={onClick}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'pointer',
          padding: 0,
          background: '#1a1a1a',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
        animate={{
          scale: isSelected ? 1.02 : dimmed ? 0.98 : 1,
          opacity: dimmed ? 0.45 : 1,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {image ? (
          <img src={image} alt={label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition || 'center center' }} />
        ) : (
          <div style={{ flex: 1, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
            <span style={{ fontSize: '11px', color: '#bbb' }}>Image</span>
          </div>
        )}
        {/* Dark scrim at bottom for text legibility */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 14px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{label}</p>
          {sublabel && (
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px', lineHeight: 1.2 }}>{sublabel}</p>
          )}
        </div>
        {/* Selection border overlay */}
        {isSelected && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '14px',
              border: '3px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
    );
  }

  // Text-only card
  return (
    <motion.button
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        cursor: 'pointer',
        border: 'none',
        padding: 0,
        background: isSelected ? '#1a1a1a' : '#f5f5f5',
        textAlign: 'center',
        flex: layout === 'four-text' ? 1 : undefined,
        minHeight: layout === 'four-text' ? 0 : '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div style={{ padding: '20px 24px' }}>
        <p style={{
          fontSize: layout === 'four-text' ? '20px' : '16px',
          fontWeight: layout === 'four-text' ? 400 : 500,
          color: isSelected ? '#fff' : '#1a1a1a',
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: layout === 'four-text' ? '0.5px' : '0.2px',
        }}>
          {label}
        </p>
      </div>
    </motion.button>
  );
}
