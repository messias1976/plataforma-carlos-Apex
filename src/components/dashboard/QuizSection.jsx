import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/MockAuthContext';
import { Brain, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the mitochondria known as?",
    options: ["The control center", "The powerhouse of the cell", "The protein maker"],
    correct: 1,
    xp: 20
  },
  {
    id: 2,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra"],
    correct: 2,
    xp: 25
  },
  {
    id: 3,
    question: "Solve for x: 2x + 5 = 15",
    options: ["5", "10", "7.5"],
    correct: 0,
    xp: 30
  }
];

const QuizSection = () => {
  const { addXP, addCoins, user, updateUser } = useAuth();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, xpEarned: 0 });

  useEffect(() => {
    let timer;
    if (activeQuestion !== null && timeLeft > 0 && selectedAnswer === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(timer);
  }, [activeQuestion, timeLeft, selectedAnswer]);

  const startQuiz = () => {
    setActiveQuestion(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setIsFinished(false);
    setScore({ correct: 0, total: 0, xpEarned: 0 });
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const currentQ = SAMPLE_QUESTIONS[activeQuestion];
    const isCorrect = index === currentQ.correct;

    if (isCorrect) {
      setScore(prev => ({
        ...prev,
        correct: prev.correct + 1,
        xpEarned: prev.xpEarned + currentQ.xp
      }));

      // Update global stats
      if (user) {
        const newStats = { ...user.stats };
        newStats.quizCorrect = (newStats.quizCorrect || 0) + 1;
        updateUser({ stats: newStats });
      }
    } else {
      if (user) {
        const newStats = { ...user.stats };
        newStats.quizIncorrect = (newStats.quizIncorrect || 0) + 1;
        updateUser({ stats: newStats });
      }
    }

    setTimeout(() => {
      if (activeQuestion < SAMPLE_QUESTIONS.length - 1) {
        setActiveQuestion(prev => prev + 1);
        setTimeLeft(30);
        setSelectedAnswer(null);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = () => {
    setIsFinished(true);
    setActiveQuestion(null);
    addXP(score.xpEarned + (selectedAnswer === SAMPLE_QUESTIONS[activeQuestion].correct ? SAMPLE_QUESTIONS[activeQuestion].xp : 0));
    addCoins(Math.floor(score.xpEarned / 2));
  };

  if (isFinished) {
    return (
      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-400 mb-6">You earned <span className="text-emerald-400 font-bold">{score.xpEarned} XP</span> and <span className="text-yellow-400 font-bold">{Math.floor(score.xpEarned / 2)} Coins</span></p>
          <Button onClick={startQuiz} className="bg-emerald-600 hover:bg-emerald-700">Try Again</Button>
        </motion.div>
      </div>
    );
  }

  if (activeQuestion === null) {
    return (
      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" /> Daily Quiz Challenge
          </h3>
          <p className="text-sm text-slate-400 mt-1">Test your knowledge and earn rewards</p>
        </div>
        <Button onClick={startQuiz} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20">
          Start Quiz
        </Button>
      </div>
    );
  }

  const currentQ = SAMPLE_QUESTIONS[activeQuestion];

  return (
    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400 text-sm">Question {activeQuestion + 1}/{SAMPLE_QUESTIONS.length}</span>
        <div className="flex items-center gap-2 text-emerald-400 font-mono">
          <Clock className="w-4 h-4" />
          {timeLeft}s
        </div>
      </div>

      <Progress value={(timeLeft / 30) * 100} className="h-1 mb-8" indicatorClassName={timeLeft < 10 ? "bg-red-500" : "bg-emerald-500"} />

      <h3 className="text-xl font-bold text-white mb-8">{currentQ.question}</h3>

      <div className="space-y-3">
        {currentQ.options.map((option, index) => {
          let btnClass = "w-full justify-start text-left py-6 text-base bg-slate-800 hover:bg-slate-700 border-slate-700";
          if (selectedAnswer !== null) {
            if (index === currentQ.correct) btnClass = "w-full justify-start text-left py-6 text-base bg-emerald-900/50 border-emerald-500 text-emerald-100 hover:bg-emerald-900/50";
            else if (index === selectedAnswer) btnClass = "w-full justify-start text-left py-6 text-base bg-red-900/50 border-red-500 text-red-100 hover:bg-red-900/50";
            else btnClass = "w-full justify-start text-left py-6 text-base bg-slate-800/50 opacity-50";
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={btnClass}
              onClick={() => selectedAnswer === null && handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <span className="mr-4 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs opacity-50">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
              {selectedAnswer !== null && index === currentQ.correct && <CheckCircle className="ml-auto w-5 h-5 text-emerald-400" />}
              {selectedAnswer !== null && index === selectedAnswer && index !== currentQ.correct && <XCircle className="ml-auto w-5 h-5 text-red-400" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSection;