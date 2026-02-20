import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

const MOCK_QUESTIONS = [
  {
    id: 1,
    question_text: "What is the primary function of React's useState hook?",
    options: ["To handle side effects", "To manage local component state", "To access global context", "To optimize performance"],
    correct_answer: 1
  },
  {
    id: 2,
    question_text: "Which method is used to pass data from a parent to a child component?",
    options: ["State", "Props", "Context", "Redux"],
    correct_answer: 1
  },
  {
    id: 3,
    question_text: "What does JSX stand for?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON Xchange Schema", "JavaScript X-Mode"],
    correct_answer: 0
  }
];

const QuizModal = ({ isOpen, onClose, quizId, topicId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Load Mock Questions
      setLoading(true);
      setTimeout(() => {
        setQuestions(MOCK_QUESTIONS);
        setScore(0);
        setCurrentQIndex(0);
        setShowResult(false);
        setSelectedOption(null);
        setLoading(false);
      }, 500);
    }
  }, [isOpen, quizId]);

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === questions[currentQIndex].correct_answer;

    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        finishQuiz(isCorrect ? score + 1 : score);
      }
    }, 1000);
  };

  const finishQuiz = async (finalScore) => {
    setShowResult(true);

    if (user) {
      const passed = finalScore / questions.length >= 0.6; // 60% pass rate

      if (passed) {
        // Mock Saving Progress
        toast({
          title: "Topic Completed!",
          description: `You scored ${finalScore}/${questions.length}`,
          className: "bg-neon-500 text-white border-none"
        });

        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        toast({
          title: "Try Again",
          description: "You need 60% to pass this topic.",
          variant: "destructive"
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-neon-500/20 text-white sm:max-w-md rounded-2xl" aria-describedby="quiz-modal-desc">
        <DialogHeader>
          <DialogTitle className="text-neon-500">Knowledge Check (Mock)</DialogTitle>
          <DialogDescription id="quiz-modal-desc">
            Responda as perguntas do quiz para testar seu conhecimento. O resultado será exibido ao final.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">Loading questions...</div>
        ) : showResult ? (
          <div className="py-8 text-center space-y-4">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <h3 className="text-2xl font-bold">Quiz Complete!</h3>
            <p className="text-slate-300">
              You scored <span className="text-neon-500 font-bold">{score}</span> out of {questions.length}
            </p>
            <Button onClick={onClose} className="w-full rounded-2xl">Close</Button>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Question {currentQIndex + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <Progress value={((currentQIndex) / questions.length) * 100} className="h-2 rounded-full" />

            <h3 className="text-lg font-medium">{questions[currentQIndex].question_text}</h3>

            <div className="grid gap-3">
              {questions[currentQIndex].options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className={`justify-start text-left h-auto py-3 px-4 rounded-2xl ${selectedOption === idx
                    ? idx === questions[currentQIndex].correct_answer
                      ? 'bg-neon-900/50 border-neon-500 text-neon-100'
                      : 'bg-red-900/50 border-red-500 text-red-100'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                  onClick={() => !selectedOption && handleAnswer(idx)}
                  disabled={selectedOption !== null}
                >
                  <span className="mr-3 opacity-50">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                  {selectedOption !== null && idx === questions[currentQIndex].correct_answer && (
                    <CheckCircle className="ml-auto w-4 h-4 text-neon-500" />
                  )}
                  {selectedOption === idx && idx !== questions[currentQIndex].correct_answer && (
                    <XCircle className="ml-auto w-4 h-4 text-red-500" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No questions found for this quiz.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;