import { useState } from 'react';
import { motion } from 'framer-motion';
import { QueueBottomSheet } from './QueueBottomSheet';
import { EASE } from '../constants/animation';
import type { QueueItem } from '../types';

interface ProfileScreenProps {
  queueCount: number;
  queueItems: QueueItem[];
  onRemoveFromQueue: (id: string) => void;
  onBack: () => void;
}

const lookImages = [
  '/images/profile/look_2.jpg',
  '/images/profile/look_1.jpg',
  '/images/profile/look_3.jpg',
];

export function ProfileScreen({ queueCount, queueItems, onRemoveFromQueue, onBack }: ProfileScreenProps) {
  const [showQueue, setShowQueue] = useState(false);
  const [activeTab, setActiveTab] = useState<'looks' | 'private'>('looks');

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fff',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        y: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
    >
      {/* Top bar */}
      <motion.div
        style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0, gap: 10 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {/* Queue badge with spinner */}
        {queueCount > 0 && (
          <motion.button
            onClick={() => setShowQueue(true)}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Spinning progress ring */}
            <motion.svg
              width="36" height="36" viewBox="0 0 36 36"
              style={{ position: 'absolute', inset: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e0e0e0" strokeWidth="2" />
              <path d="M18 3a15 15 0 0 1 15 15" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
            {/* Clock icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              <circle cx="8" cy="8" r="6.5" stroke="#1a1a1a" strokeWidth="1.2" />
              <path d="M8 4.5V8L10.5 9.5" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Count badge */}
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 18, height: 18, borderRadius: 9,
              background: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{queueCount}</span>
            </div>
          </motion.button>
        )}

        {/* Invites badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '6px 12px', borderRadius: 16, background: '#f5f5f5',
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Invites</span>
          <div style={{
            width: 18, height: 18, borderRadius: 9, background: '#e74c3c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>3</span>
          </div>
        </div>

        {/* Hamburger menu */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 6H19M3 11H19M3 16H19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>

      {/* Profile info */}
      <div style={{ padding: '12px 20px 0' }}>
        {/* Row: profile pic + username/stats */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: EASE }}
        >
          {/* Profile pic */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/images/profile/profile_pic.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Username + stats */}
          <div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px' }}>humbeck</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 13, color: '#1a1a1a' }}>
                <span style={{ fontWeight: 600 }}>0</span>{' '}
                <span style={{ color: '#999' }}>Following</span>
              </span>
              <span style={{ fontSize: 13, color: '#1a1a1a' }}>
                <span style={{ fontWeight: 600 }}>{lookImages.length}</span>{' '}
                <span style={{ color: '#999' }}>Try Ons</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit / Share buttons — own row below */}
        <motion.div
          style={{ display: 'flex', gap: 8 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4, ease: EASE }}
        >
          <button style={{
            flex: 1, height: 36, borderRadius: 18,
            background: '#f0f0f0', border: 'none',
            fontSize: 13, fontWeight: 600, color: '#1a1a1a', cursor: 'pointer',
          }}>
            Edit Profile
          </button>
          <button style={{
            flex: 1, height: 36, borderRadius: 18,
            background: '#f0f0f0', border: 'none',
            fontSize: 13, fontWeight: 600, color: '#1a1a1a', cursor: 'pointer',
          }}>
            Share Profile
          </button>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', flexShrink: 0, marginTop: 16 }}>
        <button
          onClick={() => setActiveTab('looks')}
          style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 500, color: activeTab === 'looks' ? '#1a1a1a' : '#999',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Looks
          {activeTab === 'looks' && (
            <span style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 32, height: 2, background: '#1a1a1a', borderRadius: 1 }} />
          )}
        </button>
        <button
          onClick={() => setActiveTab('private')}
          style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 500, color: activeTab === 'private' ? '#1a1a1a' : '#999',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="5.5" width="8" height="5.5" rx="1" stroke={activeTab === 'private' ? '#1a1a1a' : '#999'} strokeWidth="1.2" />
            <path d="M3.5 5.5V4C3.5 2.62 4.62 1.5 6 1.5C7.38 1.5 8.5 2.62 8.5 4V5.5" stroke={activeTab === 'private' ? '#1a1a1a' : '#999'} strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Private
          {activeTab === 'private' && (
            <span style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 32, height: 2, background: '#1a1a1a', borderRadius: 1 }} />
          )}
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'looks' ? (
          /* Looks grid — real look images */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, padding: '5% 0 0' }}>
            {lookImages.map((src, i) => (
              <motion.div
                key={i}
                style={{
                  aspectRatio: '3/7',
                  background: '#fff',
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.45, ease: EASE }}
              >
                <img src={src} alt={`Look ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top' }} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Private tab — empty state */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
            <p style={{ fontSize: 14, color: '#bbb', textAlign: 'center' }}>
              Private looks will appear here
            </p>
          </div>
        )}
      </div>

      {/* Bottom nav bar */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50,
        borderTop: '1px solid #f0f0f0',
        paddingBottom: 4,
        background: '#fff',
      }}>
        {/* Home — navigates back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
            <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" />
          </svg>
        </button>
        {/* Search */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" /><path d="M16 16L21 21" strokeLinecap="round" />
        </svg>
        {/* Plus */}
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5">
            <path d="M8 2V14M2 8H14" strokeLinecap="round" />
          </svg>
        </div>
        {/* Bell */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" /><path d="M13.73 21A2 2 0 0 1 10.27 21" />
        </svg>
        {/* Profile — active */}
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #1a1a1a', overflow: 'hidden' }}>
          <img src="/images/profile/profile_pic.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Queue bottom sheet */}
      <QueueBottomSheet
        isOpen={showQueue}
        items={queueItems}
        onRemoveItem={onRemoveFromQueue}
        onClose={() => setShowQueue(false)}
      />
    </motion.div>
  );
}
