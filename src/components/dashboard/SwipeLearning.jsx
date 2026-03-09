import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import ProtectedFeature from '@/components/subscription/ProtectedFeature';
import { useAuth } from '@/contexts/MockAuthContext';

const SWIPE_TOPICS = [
  { disciplina: 'fisica', tema: 'Leis de Newton' },
  { disciplina: 'biologia', tema: 'Fotossintese e respiracao celular' },
  { disciplina: 'matematica', tema: 'Porcentagem e regra de tres' },
  { disciplina: 'historia', tema: 'Revolucao Industrial' },
  { disciplina: 'portugues', tema: 'Interpretacao de texto' },
  { disciplina: 'geral', tema: 'Atualidades e raciocinio logico' },
];

const CARD_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-green-600 to-emerald-700',
  'from-fuchsia-600 to-rose-700',
  'from-cyan-600 to-sky-700',
  'from-orange-600 to-amber-700',
];

const normalizeQuestions = (payload) => {
  const questions = payload?.data?.questions || payload?.questions || [];

  if (!Array.isArray(questions)) {
    return [];
  }

  return questions
    .map((question, idx) => {
      const options = Array.isArray(question?.options) ? question.options : [];
      const correctAnswer = Number.isInteger(question?.correct) ? question.correct : -1;

      if (!question?.question || options.length < 2 || correctAnswer < 0 || correctAnswer >= options.length) {
        return null;
      }

      return {
        id: `${question.question}-${idx}`,
        topic: payload?.data?.subject || payload?.subject || 'Geral',
        question: question.question,
        options,
        correctAnswer,
        color: CARD_COLORS[idx % CARD_COLORS.length],
      };
    })
    .filter(Boolean);
};

const SwipeLearning = () => {
  const { t } = useTranslation();
  const { api } = useAuth();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { width, height } = useWindowSize();

  const selectedTopic = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * SWIPE_TOPICS.length);
    return SWIPE_TOPICS[randomIndex];
  }, [refreshKey]);

  const loadAiCards = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const payload = await api('/ai/generate-exam', {
        method: 'POST',
        body: JSON.stringify({
          disciplina: selectedTopic.disciplina,
          tema: selectedTopic.tema,
          nivel: 'medio',
        }),
      });

      const normalized = normalizeQuestions(payload);

      if (normalized.length === 0) {
        throw new Error('A IA nao retornou perguntas validas para o Swipe Learning.');
      }

      setCards(normalized);
      setCurrentIndex(0);
    } catch (error) {
      setCards([]);
      setLoadError(error?.message || 'Nao foi possivel carregar perguntas da IA agora.');
    } finally {
      setIsLoading(false);
    }
  }, [api, selectedTopic.disciplina, selectedTopic.tema]);

  useEffect(() => {
    loadAiCards();
  }, [loadAiCards]);

  const handleAnswer = (answerIndex) => {
    const correct = answerIndex === currentCard.correctAnswer;
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } 

    setTimeout(() => {
      handleNext();
    }, 2500);
  };

  const handleNext = () => {
    setDirection(1);
    setShowAnswer(false);
    setIsCorrect(null);

    const isLastCard = currentIndex >= cards.length - 1;

    setTimeout(() => {
      if (isLastCard) {
        setRefreshKey((prev) => prev + 1);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      setDirection(0);
    }, 200);
  };

  const currentCard = cards[currentIndex];

  const variants = {
    enter: { scale: 0.9, opacity: 0, y: 50 },
    center: { scale: 1, opacity: 1, y: 0, x: 0 },
    exit: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      rotate: direction > 0 ? 20 : -20,
      transition: { duration: 0.2 }
    })
  };

  return (
    <ProtectedFeature feature="studyZone">
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-md mx-auto relative">
        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.3} />}
        
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {t('dashboard.tabs.swipe')} <span className="text-xs bg-emerald-500 text-slate-900 px-2 py-0.5 rounded">Beta</span>
        </h2>

        {isLoading && (
          <div className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center text-white/80">
            Carregando perguntas da IA...
          </div>
        )}

        {!isLoading && loadError && (
          <div className="w-full rounded-2xl border border-red-500/30 bg-red-900/20 p-6 text-center text-red-200">
            <p className="mb-4">{loadError}</p>
            <Button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {t('common.tryAgain')}
            </Button>
          </div>
        )}
        
        {!isLoading && !loadError && currentCard && (
        <div className="relative w-full h-[500px]">
            <AnimatePresence custom={direction}>
            <motion.div
                key={currentCard.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate={variants.center}
                exit="exit"
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${currentCard.color} p-8 flex flex-col justify-between shadow-2xl border border-white/10`}
            >
                {/* Visual Feedback Overlay */}
                {showAnswer && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 z-10 rounded-3xl flex items-center justify-center bg-black/50 backdrop-blur-sm`}
                     >
                         <div className="flex flex-col items-center">
                            <span className="text-6xl mb-4">{isCorrect ? '🎉' : '😢'}</span>
                            <span className={`text-3xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                              {isCorrect ? 'Acertou!' : 'Errou!'}
                            </span>
                         </div>
                     </motion.div>
                )}

                <div>
                    <span className="inline-block bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white mb-4">
                        {currentCard.topic}
                    </span>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-4"
                    >
                        <p className="text-lg text-white/90 leading-relaxed font-medium mb-4">
                        {currentCard.question}
                        </p>
                        
                        <div className="space-y-3">
                            {currentCard.options.map((option, idx) => (
                                <Button
                                    key={idx}
                                  onClick={() => !showAnswer && handleAnswer(idx)}
                                    className={`w-full text-white border-2 border-white/30 font-bold text-lg h-12 ${
                                        showAnswer 
                                            ? idx === currentCard.correctAnswer 
                                                ? 'bg-green-500/50 border-green-500' 
                                                : 'bg-white/10'
                                            : 'bg-white/20 hover:bg-white/30'
                                    }`}
                                  disabled={showAnswer}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            </AnimatePresence>
        </div>
          )}
        </div>
    </ProtectedFeature>
  );
};

export default SwipeLearning;