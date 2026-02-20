import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { Share2, Heart, MessageCircle, X, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import ProtectedFeature from '@/components/subscription/ProtectedFeature';

const CARDS = [
  {
    id: 1,
    topic: "Física",
    title: "Primeira Lei de Newton",
    question: "Um objeto em repouso permanece em repouso a menos que uma força atue sobre ele?",
    options: ["Verdadeiro", "Falso"],
    correctAnswer: 0,
    explanation: "Correto! Isso é a inércia - objetos tendem a manter seu estado de movimento.",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    topic: "Biologia",
    title: "Fotossíntese",
    question: "As plantas produzem oxigênio durante a fotossíntese?",
    options: ["Sim", "Não"],
    correctAnswer: 0,
    explanation: "Exato! As plantas liberam O₂ como subproduto da fotossíntese.",
    color: "from-green-600 to-emerald-700"
  }
];

const SwipeLearning = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

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
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CARDS.length);
      setDirection(0);
    }, 200);
  };

  const currentCard = CARDS[currentIndex];

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
            {t('swipe.title')} <span className="text-xs bg-emerald-500 text-slate-900 px-2 py-0.5 rounded">Beta</span>
        </h2>
        
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
                                {isCorrect ? t('swipe.correct') : t('swipe.wrong')}
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
        </div>
    </ProtectedFeature>
  );
};

export default SwipeLearning;