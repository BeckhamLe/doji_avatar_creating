import { useState, useCallback } from 'react';
import { quizQuestions, getStyleProfile } from '../data/quizData';
import type { StyleProfile } from '../types';

export function useQuizState() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<StyleProfile | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const totalQuestions = quizQuestions.length;

  const selectAnswer = useCallback((questionId: number, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));

    // Auto-advance after selection
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 400);
    } else {
      // Last question — compute result
      setTimeout(() => {
        const updatedAnswers = { ...answers, [questionId]: answerId };
        const profile = getStyleProfile(updatedAnswers);
        setResult(profile);
        setIsComplete(true);
      }, 400);
    }
  }, [currentQuestion, totalQuestions, answers]);

  const goBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setIsComplete(false);
  }, []);

  return {
    currentQuestion,
    totalQuestions,
    question: quizQuestions[currentQuestion],
    answers,
    result,
    isComplete,
    selectAnswer,
    goBack,
    resetQuiz,
  };
}
