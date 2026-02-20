import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, User, Bot, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

const TeacherModal = ({ isOpen, onClose, initialTopic = '' }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Olá! Sou seu professor IA. Qual assunto você gostaria de aprender hoje?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handlePersonalize = () => {
    if (!topic.trim()) return;

    const userMessage = { role: 'user', text: topic };
    setMessages(prev => [...prev, userMessage]);
    setTopic('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        title: userMessage.text,
        text: `Preparei uma aula exclusiva sobre "${userMessage.text}". \n\n1. Conceitos Fundamentais\nO conceito principal envolve entender a estrutura básica e suas interações no sistema.\n\n2. Aplicações Práticas\nIsso é utilizado frequentemente em cenários do mundo real para otimizar processos.\n\n3. Exercícios de Fixação\nTente aplicar este conceito em um problema simples para consolidar o aprendizado.\n\nVamos aprofundar em algum ponto específico?`
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] p-0" aria-describedby="teacher-modal-desc">
            <DialogDescription id="teacher-modal-desc" className="sr-only">
              Modal de aula personalizada com IA. Digite o tema desejado e receba uma explicação instantânea.
            </DialogDescription>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Bot className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Professor IA <Sparkles className="w-4 h-4 text-green-400" />
                  </h3>
                  <p className="text-xs text-slate-400">Aula personalizada instantânea</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
              ref={scrollRef}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user'
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-green-600 border-green-500'
                    }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>

                  <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-slate-800 text-white rounded-tr-none border border-slate-700'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}>
                    {msg.title && (
                      <div className="flex items-center gap-2 font-bold text-green-400 mb-2 pb-2 border-b border-white/5 capitalize">
                        <BookOpen className="w-4 h-4" />
                        {msg.title}
                      </div>
                    )}
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0 border border-green-500">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                    <span className="text-sm text-slate-400 font-medium">Gerando conteúdo da aula...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-sm">
              <div className="flex gap-2 relative">
                <Input
                  placeholder="Sobre o que você quer aprender? (ex: Revolução Industrial)"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-green-500 pr-12 py-6"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePersonalize()}
                  disabled={isLoading}
                  autoFocus
                />
                <Button
                  onClick={handlePersonalize}
                  disabled={isLoading || !topic.trim()}
                  className="absolute right-1 top-1 bottom-1 bg-green-600 hover:bg-green-700 text-white aspect-square w-auto px-3"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="mt-2 text-xs text-center text-slate-500">
                Pressione Enter para enviar • IA treinada em conteúdo educacional
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TeacherModal;