import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneShell } from './components/PhoneShell';
import { PicSelectionScreen } from './components/PicSelectionScreen';
import { MergeTransition } from './components/MergeTransition';
import type { ShapeSnapshot } from './components/MergeTransition';
import { LoadingScreen } from './components/LoadingScreen';
import type { LoadingScreenHandle } from './components/LoadingScreen';
import { BlobTransition } from './components/BlobTransition';
import type { BlobRect } from './components/BlobTransition';
import { calculatePupilPosition } from './utils/pupilMath';
// Preload quiz chunk so it's ready before blob transition needs it
const quizImport = import('./components/QuizScreen');
const QuizScreen = lazy(() => quizImport.then(m => ({ default: m.QuizScreen })));
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

// Separate config for where the blob emerges in the loading → quiz transition.
// Adjust these to position the blob's starting point on the pupil.
const BLOB_PUPIL = {
  pupilX: 0.5,
  pupilY: 0.63,
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
  const [showBlobTransition, setShowBlobTransition] = useState(false);
  const [blobSource, setBlobSource] = useState<BlobRect | null>(null);
  const [blobDestScreen, setBlobDestScreen] = useState<Screen | null>(null);
  const [blobTargetSelector, setBlobTargetSelector] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

    // Fade the pic selection UI (text, buttons, badges) AND fade shape images to black
    setPicSelectionFading(true);

    // Show merge layer on top (but PicSelectionScreen stays visible underneath during fade)
    setShowMerge(true);
    setActiveScreen('merging');
  }, []);

  const handleShapesClonesReady = useCallback(() => {
    // Merge clones are in position on top — safe to hide PicSelectionScreen now
    setShowPicSelection(false);
    setPicSelectionFading(false);
  }, []);

  const handleBlackScreenReady = useCallback(() => {
    // Screen is fully black. Loading screen is already rendered behind (z-10).
    // Ensure zoomed-in state is set (it's the default, but be explicit).
    setLoadingZoomedIn(true);
  }, []);

  const handleIrisComplete = useCallback(() => {
    // Iris retraction done — loading screen is revealed. Start zoom out.
    setShowMerge(false);
    setActiveScreen('loading');
    setLoadingZoomedIn(false);
  }, []);

  const handleZoomComplete = useCallback(() => {
    setFaceActive(true);
    startProgress();
  }, [startProgress]);

  const getPupilRect = useCallback((): BlobRect => {
    const phoneEl = document.querySelector('.phone-shell');
    if (!phoneEl) return { left: 0, top: 0, width: 12, height: 12 };
    const { x, y } = calculatePupilPosition(phoneEl.clientWidth, phoneEl.clientHeight, BLOB_PUPIL.pupilX, BLOB_PUPIL.pupilY);
    return { left: x - 6, top: y - 6, width: 12, height: 12 };
  }, []);

  // Start the full transition: zoom-in → blob from pupil → retract to target
  const startBlobTransition = useCallback((_e: React.MouseEvent, destScreen: Screen, targetSelector: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setBlobDestScreen(destScreen);
    setBlobTargetSelector(targetSelector);

    loadingScreenRef.current?.prepareForZoomIn();

    // Phase 1: Zoom in on the loading screen toward the pupil
    loadingScreenRef.current?.zoomIn(() => {
      // Hold on the zoomed-in eye so the user sees the pupil before black emerges
      setTimeout(() => {
        // Phase 2: Now start the blob transition from the pupil
        setBlobSource(getPupilRect());
        setShowBlobTransition(true);
      }, 300);
    });
  }, [getPupilRect, isTransitioning]);

  const handleBlobBlackScreen = useCallback(() => {
    if (blobDestScreen) {
      setActiveScreen(blobDestScreen);
    }
  }, [blobDestScreen]);

  const measureBlobTarget = useCallback((): BlobRect | null => {
    if (!blobTargetSelector) return null;
    const targetEl = document.querySelector(blobTargetSelector);
    const phoneEl = document.querySelector('.phone-shell');
    if (!targetEl || !phoneEl) return null;
    const phoneRect = phoneEl.getBoundingClientRect();
    const tgtRect = targetEl.getBoundingClientRect();
    return {
      left: tgtRect.left - phoneRect.left,
      top: tgtRect.top - phoneRect.top,
      width: tgtRect.width,
      height: tgtRect.height,
    };
  }, [blobTargetSelector]);

  const handleBlobComplete = useCallback(() => {
    setShowBlobTransition(false);
    setBlobSource(null);
    setBlobDestScreen(null);
    setBlobTargetSelector(null);
    setIsTransitioning(false);
    loadingScreenRef.current?.resetZoom();
  }, []);

  return (
    <PhoneShell>
      {/* Loading screen — base layer, only visible after black screen covers everything */}
      <LoadingScreen
        ref={loadingScreenRef}
        progress={progress}
        isZoomedIn={loadingZoomedIn}
        faceActive={faceActive}
        avatarReady={avatarReady}
        zoomConfig={ZOOM_CONFIG}
        onZoomComplete={handleZoomComplete}
        onDiscoverStyle={(e?: React.MouseEvent) => {
          if (e) {
            startBlobTransition(e, 'quiz', '[data-quiz-dot="first"]');
          } else {
            setActiveScreen('quiz');
          }
        }}
        onExploreLooks={() => setActiveScreen('exploration')}
        onReveal={() => setActiveScreen('reveal')}
      />

      {/* Merge transition — renders its own white bg, merge shapes, and iris */}
      {showMerge && (
        <MergeTransition
          shapes={shapeSnapshots}
          onShapesClonesReady={handleShapesClonesReady}
          onBlackScreenReady={handleBlackScreenReady}
          onIrisComplete={handleIrisComplete}
        />
      )}

      {/* Blob transition — for button-to-screen transitions */}
      {showBlobTransition && blobSource && !showMerge && (
        <BlobTransition
          pupilRect={blobSource}
          measureTarget={measureBlobTarget}
          onBlackScreen={handleBlobBlackScreen}
          onComplete={handleBlobComplete}
        />
      )}

      {/* Pic selection — stays mounted during merge (merge layer covers it) */}
      {showPicSelection && (
        <PicSelectionScreen
          onCreateLikeness={handleCreateLikeness}
          isFading={picSelectionFading}
        />
      )}

      {/* Other overlay screens */}
      <AnimatePresence>
        {activeScreen === 'quiz' && (
          <Suspense key="quiz-suspense" fallback={null}>
          <QuizScreen
            key="quiz"
            skipEntrance={showBlobTransition}
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

      {/* Completion popup — shown when avatar finishes while user is on quiz/explore */}
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
