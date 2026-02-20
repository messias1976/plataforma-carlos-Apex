
import React, { useState, useEffect, useRef } from 'react';
import { askChatGPT } from '@/lib/chatgpt';
import { motion } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/MockAuthContext';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Settings,
  Brain
} from 'lucide-react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AITeacher = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { api } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persisted state
  const [personality, setPersonality] = useState(() => localStorage.getItem('apex_ai_personality') || 'motivadora');
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem('apex_ai_size');
    return saved ? JSON.parse(saved) : { width: 400, height: 600 };
  });
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('apex_ai_pos');
    return saved ? JSON.parse(saved) : { x: 50, y: 50 };
  });

  const scrollRef = useRef(null);
  const { width, height } = useWindowSize();

  // Save state on change
  useEffect(() => {
    localStorage.setItem('apex_ai_personality', personality);
  }, [personality]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isMinimized]);

  const handleDragStop = (e, d) => {
    const newPos = { x: d.x, y: d.y };
    setPosition(newPos);
    localStorage.setItem('apex_ai_pos', JSON.stringify(newPos));
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const newSize = { width: ref.style.width, height: ref.style.height };
    setSize(newSize);
    setPosition(position);
    localStorage.setItem('apex_ai_size', JSON.stringify(newSize));
    localStorage.setItem('apex_ai_pos', JSON.stringify(position));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Prompt personalizado para gerar conteúdo, perguntas e alternativas
      const systemPrompt = {
        role: 'system',
        content: `Você é um professor particular de IA, acolhedor, humano e didático, com personalidade ${personality}. Sempre cumprimente o aluno de forma simpática e incentive perguntas, mesmo que sejam simples ou apenas saudações. Responda dúvidas, explique temas, crie perguntas, exercícios e provas quando solicitado. Se o aluno pedir perguntas, gere perguntas e alternativas de múltipla escolha, adequadas ao perfil e contexto. Nunca peça para digitar apenas o nome da matéria, sempre tente ajudar com base no que o aluno disser, mesmo que seja uma saudação ou comando curto. Seja proativo, incentive o aprendizado e adapte a resposta ao nível do aluno.`
      };
      const chatMessages = [systemPrompt, ...messages, userMessage];
      const aiResponse = await askChatGPT(chatMessages, api);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      let errorMsg = 'Erro ao conectar com a IA.';
      if (err instanceof TypeError || (err.message && err.message.includes('conectar'))) {
        errorMsg = 'Não foi possível conectar ao servidor. Tente novamente mais tarde ou verifique sua conexão.';
      }
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const personalities = [
    { id: 'motivadora', icon: '🌟', label: 'Motivadora' },
    { id: 'brava', icon: '😤', label: 'Brava / Exigente' },
    { id: 'calma', icon: '🧘', label: 'Calma / Zen' },
    { id: 'sarcástica', icon: '😏', label: 'Sarcástica' },
    { id: 'einstein', icon: '🧠', label: 'Einstein / Gênio' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[50] pointer-events-none">
        <Rnd
          size={isMinimized ? { width: 300, height: 'auto' } : { width: size.width, height: size.height }}
          position={position}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          minWidth={300}
          minHeight={isMinimized ? 60 : 400}
          disableResizing={isMinimized}
          bounds="window"
          dragHandleClassName="ai-drag-handle"
          className="pointer-events-auto z-[50]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col bg-slate-950 border border-neon-500/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            <div className="ai-drag-handle p-3 border-b border-neon-500/20 bg-gradient-to-r from-slate-900 to-slate-950 flex items-center justify-between cursor-move select-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-500/20 flex items-center justify-center border border-neon-500/50">
                  <Bot className="w-5 h-5 text-neon-400" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    Professor IA
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-white"
                  onClick={() => setIsSettingsOpen(true)}
                  title="Personalizar"
                >
                  <Settings className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-white"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-white hover:bg-red-500/20"
                  onClick={onClose}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Active Personality Indicator */}
                <div className="bg-slate-900/50 p-2 border-b border-white/5 flex items-center justify-between px-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Brain className="w-3 h-3 text-neon-500" />
                    Modo: <span className="text-white font-medium">{personalities.find(p => p.id === personality)?.label}</span>
                  </div>
                  <div className="text-[10px] opacity-70 cursor-pointer hover:underline" onClick={() => setIsSettingsOpen(true)}>Alterar</div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80 scrollbar-thin scrollbar-thumb-neon-500/20 scrollbar-track-transparent" ref={scrollRef}>
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-4">
                      <Bot className="w-12 h-12 opacity-20" />
                      <p className="text-sm max-w-[250px]">
                        Olá! Sou sua IA <strong>{personalities.find(p => p.id === personality)?.label}</strong>. Como posso ajudar nos seus estudos hoje?
                      </p>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md ${msg.role === 'user'
                          ? 'bg-neon-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                          }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700 flex items-center gap-1">
                        <span className="w-2 h-2 bg-neon-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-neon-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 bg-neon-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-neon-500/20">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Digite sua dúvida..."
                      className="bg-slate-800 border-slate-700 text-white focus:ring-neon-500/20 focus:border-neon-500 rounded-xl h-10"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isTyping || !input.trim()}
                      className="bg-neon-600 hover:bg-neon-500 text-white rounded-xl h-10 w-10 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </Rnd>
      </div>

      {/* Settings Dialog - Outside Rnd to avoid transform issues */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white z-[60]" aria-describedby="ai-settings-desc">
          <DialogHeader>
            <DialogTitle>Personalização da IA</DialogTitle>
            <DialogDescription id="ai-settings-desc" className="text-slate-400">
              Escolha como você quer que seu professor interaja com você.<br />
              <span className="text-xs text-yellow-400">Sua chave OpenAI não será enviada para terceiros.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Label htmlFor="personality" className="text-right mb-2 block">Personalidade</Label>
            <Select value={personality} onValueChange={setPersonality}>
              <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecione uma personalidade" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white z-[70]">
                {personalities.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="flex items-center gap-2">
                      <span>{p.icon}</span> {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)} className="bg-neon-600 hover:bg-neon-500 text-white">
              Salvar Preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AITeacher;
