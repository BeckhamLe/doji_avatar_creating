import { motion, AnimatePresence } from 'framer-motion';
import type { QueueItem } from '../types';

interface QueueBottomSheetProps {
  isOpen: boolean;
  items: QueueItem[];
  onRemoveItem: (id: string) => void;
  onClose: () => void;
}

export function QueueBottomSheet({ isOpen, items, onRemoveItem, onClose }: QueueBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 41,
              background: '#fff',
              borderRadius: '20px 20px 0 0',
              maxHeight: '60%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.3}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 60 || info.velocity.y > 300) {
                onClose();
              }
            }}
          >
            {/* Drag handle */}
            <div
              onClick={onClose}
              style={{ paddingTop: 12, paddingBottom: 8, display: 'flex', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{ width: 36, height: 5, background: '#d4d4d4', borderRadius: 3 }} />
            </div>

            {/* Title */}
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', textAlign: 'center', paddingBottom: 16, flexShrink: 0 }}>
              Queue
            </p>

            {/* Items list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
              {items.length === 0 ? (
                <p style={{ fontSize: 13, color: '#999', textAlign: 'center', paddingTop: 24 }}>
                  No items in queue
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: '#fff', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.brand}
                        </p>
                        <p style={{ fontSize: 12, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </p>
                      </div>

                      {/* Spinner */}
                      <motion.div
                        style={{ width: 20, height: 20, flexShrink: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="#e0e0e0" strokeWidth="2" />
                          <path d="M10 2a8 8 0 0 1 8 8" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </motion.div>

                      {/* Cancel button */}
                      <motion.button
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          background: '#f5f5f5',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1 1L9 9M9 1L1 9" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
