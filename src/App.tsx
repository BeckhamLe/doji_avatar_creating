import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneShell } from './components/PhoneShell';
import { PicSelectionScreen } from './components/PicSelectionScreen';
import { MergeTransition } from './components/MergeTransition';
import type { ShapeSnapshot } from './components/MergeTransition';
import { LoadingScreen } from './components/LoadingScreen';
import type { LoadingScreenHandle } from './components/LoadingScreen';
const QuizScreen = lazy(() => import('./components/QuizScreen').then(m => ({ default: m.QuizScreen })));
const ExplorationScreen = lazy(() => import('./components/ExplorationScreen').then(m => ({ default: m.ExplorationScreen })));
const RevealScreen = lazy(() => import('./components/RevealScreen').then(m => ({ default: m.RevealScreen })));
const ProfileScreen = lazy(() => import('./components/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
import { useAvatarProgress } from './hooks/useAvatarProgress';
import { useQuizState } from './hooks/useQuizState';
import { useTryOnQueue } from './hooks/useTryOnQueue';
import { useLikedItems } from './hooks/useLikedItems';
import { allItems } from './data/brandData';
import type { Screen, ProductItem } from './types';

const ZOOM_CONFIG = {
  pupilX: 0.29,
  pupilY: 0.40,
  zoomStart: 6,
  zoomDuration: 800,
};

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('pic-selection');
  const [loadingZoomedIn, setLoadingZoomedIn] = useState(true);
  const [faceActive, setFaceActive] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [showPicSelection, setShowPicSelection] = useState(true);
  const [picSelectionFading, setPicSelectionFading] = useState(false);
  const [shapeSnapshots, setShapeSnapshots] = useState<ShapeSnapshot[]>([]);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [avatarReady, setAvatarReady] = useState(false);
  const loadingScreenRef = useRef<LoadingScreenHandle>(null);
  const { progress, isComplete, startProgress } = useAvatarProgress();
  const quiz = useQuizState();
  const tryOn = useTryOnQueue();
  const liked = useLikedItems();
  const completionNotified = useRef(false);

  const queueItems = useMemo(() => {
    return [...tryOn.shortlist]
      .map(id => allItems.find(item => item.id === id))
      .filter((item): item is ProductItem => !!item);
  }, [tryOn.shortlist]);

  // When avatar completes, decide: show popup if on quiz/explore, or mark ready for loading screen
  useEffect(() => {
    if (!isComplete || completionNotified.current) return;
    completionNotified.current = true;
    setAvatarReady(true);

    if (activeScreen === 'quiz' || activeScreen === 'exploration') {
      setShowCompletionPopup(true);
    }
  }, [isComplete, activeScreen]);

  const handleCreateLikeness = useCallback(() => {
    // Unlock videos during this user gesture so they can play later on mobile Safari
    loadingScreenRef.current?.unlockVideos();

    // Snapshot shape positions BEFORE anything changes
    const phoneEl = document.querySelector('.phone-shell');
    const phoneRect = phoneEl?.getBoundingClientRect() || { left: 0, top: 0 };

    const shapes = document.querySelectorAll('[data-merge]');
    const snapshots: ShapeSnapshot[] = [];

    shapes.forEach((shape) => {
      const el = shape as HTMLElement;
      const rect = el.getBoundingClientRect();
      snapshots.push({
        left: rect.left - phoneRect.left,
        top: rect.top - phoneRect.top,
        width: rect.width,
        height: rect.height,
        isCircle: el.classList.contains('selfie-circle'),
      });
    });

    setShapeSnapshots(snapshots);
    setPicSelectionFading(true);
    setShowMerge(true);
    setActiveScreen('merging');
  }, []);

  const handleShapesClonesReady = useCallback(() => {
    setShowPicSelection(false);
    setPicSelectionFading(false);
  }, []);

  const handleBlackScreenReady = useCallback(() => {
    setLoadingZoomedIn(true);
  }, []);

  const handleIrisComplete = useCallback(() => {
    setShowMerge(false);
    setActiveScreen('loading');
    setLoadingZoomedIn(false);
  }, []);

  const handleZoomComplete = useCallback(() => {
    setFaceActive(true);
    startProgress();
  }, [startProgress]);

  return (
    <PhoneShell>
      <LoadingScreen
        ref={loadingScreenRef}
        progress={progress}
        isZoomedIn={loadingZoomedIn}
        faceActive={faceActive}
        avatarReady={avatarReady}
        zoomConfig={ZOOM_CONFIG}
        onZoomComplete={handleZoomComplete}
        onDiscoverStyle={() => setActiveScreen('quiz')}
        onExploreLooks={() => setActiveScreen('exploration')}
        onReveal={() => setActiveScreen('reveal')}
      />

      {showMerge && (
        <MergeTransition
          shapes={shapeSnapshots}
          onShapesClonesReady={handleShapesClonesReady}
          onBlackScreenReady={handleBlackScreenReady}
          onIrisComplete={handleIrisComplete}
        />
      )}

      {showPicSelection && (
        <PicSelectionScreen
          onCreateLikeness={handleCreateLikeness}
          isFading={picSelectionFading}
        />
      )}

      <AnimatePresence>
        {activeScreen === 'quiz' && (
          <Suspense key="quiz-suspense" fallback={null}>
          <QuizScreen
            key="quiz"
            currentQuestion={quiz.currentQuestion}
            totalQuestions={quiz.totalQuestions}
            question={quiz.question}
            answers={quiz.answers}
            result={quiz.result}
            isComplete={quiz.isComplete}
            onAnswer={quiz.selectAnswer}
            onBack={quiz.goBack}
            onExit={() => setActiveScreen('loading')}
            onExplore={() => setActiveScreen('exploration')}
            onReset={quiz.resetQuiz}
          />
          </Suspense>
        )}

        {activeScreen === 'exploration' && (
          <Suspense key="exploration-suspense" fallback={null}>
          <ExplorationScreen
            key="exploration"
            shortlistCount={tryOn.count}
            quizCompleted={quiz.isComplete}
            isInShortlist={tryOn.isInShortlist}
            isLiked={liked.isLiked}
            onToggleItem={tryOn.toggleItem}
            onToggleLike={liked.toggleLike}
            onExit={() => setActiveScreen('loading')}
          />
          </Suspense>
        )}

        {activeScreen === 'reveal' && (
          <Suspense key="reveal-suspense" fallback={null}>
          <RevealScreen
            key="reveal"
            onClose={() => setActiveScreen('loading')}
            onEnter={() => setActiveScreen('profile')}
          />
          </Suspense>
        )}
        {activeScreen === 'profile' && (
          <Suspense key="profile-suspense" fallback={null}>
          <ProfileScreen
            key="profile"
            queueCount={tryOn.count}
            queueItems={queueItems}
            onRemoveFromQueue={tryOn.toggleItem}
            onBack={() => setActiveScreen('loading')}
          />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompletionPopup && (
          <motion.div
            key="completion-popup"
            style={{
              position: 'absolute',
              bottom: 32,
              left: 20,
              right: 20,
              zIndex: 50,
              background: '#1a1a1a',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                Your avatar is ready
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Your likeness has been created.
              </p>
            </div>
            <motion.button
              onClick={() => {
                setShowCompletionPopup(false);
                setActiveScreen('reveal');
              }}
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 18,
                background: '#fff',
                color: '#1a1a1a',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Reveal
            </motion.button>
            <motion.button
              onClick={() => setShowCompletionPopup(false)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.15)',
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
                <path d="M1 1L9 9M9 1L1 9" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneShell>
  );
}

export default App;
