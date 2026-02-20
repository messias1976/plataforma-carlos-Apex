
import React, { useState, useEffect } from 'react';
import { askChatGPT } from '@/lib/chatgpt';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/MockAuthContext';
import AITeacher from './AITeacher';

// Geração dinâmica de perguntas via IA
async function generateQuestionsByAI({ subject, grade, style, theme, apiFunction }) {
   const prompt = [
      {
         role: 'system',
         content: `Você é um gerador automático de provas. Gere exatamente 5 perguntas de múltipla escolha sobre o tema "${theme || subject}", nível "${grade}", estilo "${style || 'ENEM'}", cada uma com 4 alternativas e marque a correta. Responda SOMENTE em JSON, sem explicações, no formato: [{"id":1, "text":"Pergunta...", "options":["A","B","C","D"], "correct":0, "explanation":"Explicação detalhada"}, ...]. Não escreva nada além do JSON.`
      }
   ];
   try {
      const response = await askChatGPT(prompt, apiFunction);
      return JSON.parse(response);
   } catch (err) {
      if (err instanceof TypeError || (err.message && err.message.includes('conectar'))) {
         // Retorna um array especial para exibir mensagem de erro de rede
         return { networkError: true };
      }
      return [];
   }
}

const ExamPlayer = ({ examId, subject, theme, grade, difficulty, onClose }) => {
   const { api } = useAuth();
   const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
   const [selectedAnswer, setSelectedAnswer] = useState(null);
   const [isAnswered, setIsAnswered] = useState(false);
   const [score, setScore] = useState(0);
   const [isAIOpen, setIsAIOpen] = useState(false);
   const [questions, setQuestions] = useState([]);
   const [loadingQuestions, setLoadingQuestions] = useState(true);

   useEffect(() => {
      async function fetchQuestions() {
         setLoadingQuestions(true);
         // Usa os parâmetros recebidos do card
         const q = await generateQuestionsByAI({ subject, grade, style: difficulty, theme, apiFunction: api });
         if (q && q.networkError) {
            setQuestions([]);
            setLoadingQuestions(false);
            setTimeout(() => {
               alert('Não foi possível conectar ao servidor. Tente novamente mais tarde ou verifique sua conexão.');
            }, 100);
            return;
         }
         setQuestions(q);
         setLoadingQuestions(false);
      }
      fetchQuestions();
   }, [examId, subject, theme, grade, difficulty, api]);

   const question = questions[currentQuestionIdx] || {};

   const handleConfirm = () => {
      if (selectedAnswer === null) return;
      setIsAnswered(true);
      if (selectedAnswer === question.correct) {
         setScore(s => s + 1);
      }
   };

   const handleNext = () => {
      if (currentQuestionIdx < questions.length - 1) {
         setCurrentQuestionIdx(prev => prev + 1);
         setSelectedAnswer(null);
         setIsAnswered(false);
      } else {
         onClose(score + (selectedAnswer === question.correct ? 0 : 0));
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
         <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-white font-bold">Simulado #00{examId}</h2>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => setIsAIOpen(true)}>
                  <Bot className="w-4 h-4 mr-2" /> Ajuda IA
               </Button>
               <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => onClose(null)}>Sair</Button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-slate-950">
            <Card className="w-full max-w-3xl bg-slate-900 border-slate-800 p-6 md:p-10 shadow-2xl">
               {loadingQuestions ? (
                  <div className="text-center text-white py-20">Gerando questões com IA...</div>
               ) : questions.length === 0 ? (
                  <div className="text-center text-red-400 py-20">Não foi possível gerar questões. Tente novamente.</div>
               ) : (
                  <>
                     <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-neon-500 text-sm font-bold tracking-wider uppercase">Questão {currentQuestionIdx + 1}/{questions.length}</span>
                           <span className="text-slate-500 text-xs">História / Geografia</span>
                        </div>
                        <h3 className="text-xl md:text-2xl text-white font-medium leading-relaxed">{question.text}</h3>
                     </div>

                     <div className="space-y-3">
                        {question.options && question.options.map((opt, idx) => {
                           // ...existing code...
                           let containerClass = "relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group";
                           let labelClass = "text-base font-medium";
                           if (isAnswered) {
                              if (idx === question.correct) {
                                 containerClass += " border-green-500 bg-green-500/10 z-10";
                                 labelClass += " text-green-100";
                              } else if (idx === selectedAnswer && idx !== question.correct) {
                                 containerClass += " border-red-500 bg-red-500/10";
                                 labelClass += " text-red-100";
                              } else {
                                 containerClass += " border-slate-800 bg-slate-900/50 opacity-50";
                                 labelClass += " text-slate-500";
                              }
                           } else {
                              if (selectedAnswer === idx) {
                                 containerClass += " border-neon-500 bg-neon-500/10 shadow-[0_0_15px_rgba(14,165,233,0.15)]";
                                 labelClass += " text-white";
                              } else {
                                 containerClass += " border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-750 cursor-pointer";
                                 labelClass += " text-slate-300 group-hover:text-white";
                              }
                           }
                           return (
                              <button
                                 key={idx}
                                 onClick={() => !isAnswered && setSelectedAnswer(idx)}
                                 disabled={isAnswered}
                                 className={containerClass}
                              >
                                 <span className={labelClass}>{opt}</span>
                                 {isAnswered && idx === question.correct && (
                                    <CheckCircle className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
                                 )}
                                 {isAnswered && idx === selectedAnswer && idx !== question.correct && (
                                    <XCircle className="w-6 h-6 text-red-500 animate-in zoom-in duration-300" />
                                 )}
                                 {!isAnswered && selectedAnswer === idx && (
                                    <div className="w-4 h-4 rounded-full bg-neon-500 shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                                 )}
                              </button>
                           );
                        })}
                     </div>

                     {isAnswered && (
                        <motion.div
                           initial={{ opacity: 0, y: 10, height: 0 }}
                           animate={{ opacity: 1, y: 0, height: 'auto' }}
                           className="mt-6 p-5 bg-blue-900/20 border border-blue-500/30 rounded-xl"
                        >
                           <div className="flex items-start gap-3">
                              <Bot className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                              <div>
                                 <h4 className="text-blue-400 font-bold mb-1 text-sm uppercase">Explicação do Professor</h4>
                                 <p className="text-blue-100 text-sm leading-relaxed">{question.explanation}</p>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     <div className="mt-8 flex justify-end pt-4 border-t border-slate-800">
                        {!isAnswered ? (
                           <Button
                              onClick={handleConfirm}
                              disabled={selectedAnswer === null}
                              className="bg-neon-600 hover:bg-neon-500 text-white px-8 h-12 text-lg shadow-lg shadow-neon-900/20"
                           >
                              Confirmar Resposta
                           </Button>
                        ) : (
                           <Button
                              onClick={handleNext}
                              className="bg-white text-slate-900 hover:bg-slate-200 px-8 h-12 text-lg font-bold"
                           >
                              {currentQuestionIdx < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Simulado'}
                              <ArrowRight className="w-5 h-5 ml-2" />
                           </Button>
                        )}
                     </div>
                  </>
               )}
            </Card>
         </div>

         <AITeacher isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
   );
};

export default ExamPlayer;
