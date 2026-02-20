
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, Loader2, Sparkles, User, Bot, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/MockAuthContext';

const TeacherInterface = ({ isOpen, onClose }) => {
    const { api } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Olá! Sou seu professor particular. Qual assunto você gostaria de personalizar hoje?' }
    ]);
    const [disciplina, setDisciplina] = useState(null);
    const materiasValidas = [
        "matemática",
        "história",
        "biologia",
        "geografia",
        "física",
        "química",
        "português",
        "inglês"
    ];
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setInput("");

        // SE NÃO TEM DISCIPLINA AINDA
        if (!disciplina) {
            const lower = input.toLowerCase();

            // se for cumprimento
            if (lower === "oi" || lower === "olá" || lower === "ola") {
                setMessages(prev => [
                    ...prev,
                    userMsg,
                    {
                        role: "assistant",
                        content:
                            "Olá! 😊 Digite apenas o nome da disciplina que deseja estudar (ex: matemática, história)."
                    }
                ]);
                return;
            }

            // se for disciplina válida
            setDisciplina(input);
            setMessages(prev => [
                ...prev,
                userMsg,
                {
                    role: "assistant",
                    content: `Perfeito! Vamos estudar ${input}. O que você quer saber?`
                }
            ]);
            return;
        }

        // CONVERSA NORMAL COM IA
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const data = await api('/ai/chat', {
                method: "POST",
                body: JSON.stringify({
                    message: `Disciplina: ${disciplina}\nPergunta: ${input}`
                })
            });

            setMessages(prev => [
                ...prev,
                { role: "assistant", content: data.reply }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Erro ao conectar com a IA."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] h-[80vh] bg-slate-950 border-slate-800 text-white p-0 flex flex-col overflow-hidden shadow-2xl shadow-green-900/20" aria-describedby="teacher-interface-desc">
                <DialogTitle className="sr-only">Chat com Professor</DialogTitle>
                <DialogDescription id="teacher-modal-desc" className="sr-only">
                    Janela de chat com o professor IA. Converse, tire dúvidas e peça explicações sobre qualquer matéria.
                </DialogDescription>

                {/* Header */}
                <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                <MessageCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                                Professor IA <Sparkles className="w-3 h-3 text-green-400 animate-pulse" />
                            </h3>
                            <p className="text-xs text-slate-400">Online • Personalização em tempo real</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-800 text-slate-400 rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Chat Area */}
                <ScrollArea className="flex-1 p-4 bg-slate-950/50">
                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-lg ${msg.role === 'user'
                                    ? 'bg-slate-800 border-slate-700'
                                    : 'bg-green-600 border-green-500'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>

                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-slate-800 text-white rounded-tr-sm border border-slate-700'
                                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                                    }`}>
                                    <div className="whitespace-pre-line">{msg.content}</div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0 border border-green-500">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                                    <span className="text-sm text-slate-400">Digitando...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-sm">
                    <div className="flex gap-2 relative items-end">
                        <Input
                            placeholder="Digite o tópico ou sua dúvida..."
                            className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-green-500 min-h-[50px] py-3 pr-12 rounded-xl"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            autoFocus
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1.5 bottom-1.5 h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                    <div className="mt-2 flex justify-between items-center px-1">
                        <p className="text-[10px] text-slate-500">
                            Pressione Enter para enviar
                        </p>
                        <Button variant="ghost" size="sm" className="h-5 text-[10px] text-slate-500 hover:text-green-400 px-2" onClick={() => { setMessages([{ role: 'ai', content: 'Olá! Sou seu professor particular. Qual assunto você gostaria de personalizar hoje?' }]); setDisciplina(null); }}>
                            <RefreshCw className="w-3 h-3 mr-1" /> Reiniciar Conversa
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TeacherInterface;
