import { useState, useEffect, useCallback } from 'react';

export function useAvatarProgress() {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const isComplete = progress >= 100;

  useEffect(() => {
    if (!started || progress >= 100) return;

    const getInterval = () => {
      if (progress < 30) return 800;
      if (progress < 60) return 1200;
      if (progress < 85) return 1800;
      return 2500;
    };

    const timer = setTimeout(() => {
      setProgress((prev) => {
        const increment = Math.max(1, Math.floor(Math.random() * 3) + 1);
        return Math.min(100, prev + increment);
      });
    }, getInterval());

    return () => clearTimeout(timer);
  }, [progress, started]);

  const startProgress = useCallback(() => {
    setStarted(true);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(0);
    setStarted(false);
  }, []);

  return { progress, isComplete, resetProgress, startProgress };
}
