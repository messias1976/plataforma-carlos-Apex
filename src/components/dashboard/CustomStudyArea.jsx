import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { askChatGPT } from '@/lib/chatgpt';
import { useAuth } from '@/contexts/MockAuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Send, Sparkles, RefreshCw, Check, BookOpen, Bot } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const CustomStudyArea = () => {
    const { api } = useAuth();
    const [step, setStep] = useState('selection');
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupSize, setPopupSize] = useState({ width: 420, height: 600 });
    const [popupPos, setPopupPos] = useState({ x: 80, y: 80 });
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const subjects = [
        { id: 'mat', label: 'Matemática' },
        { id: 'por', label: 'Português' },
        { id: 'his', label: 'História' },
        { id: 'geo', label: 'Geografia' },
        { id: 'bio', label: 'Biologia' },
        { id: 'fis', label: 'Física' },
        { id: 'qui', label: 'Química' },
        { id: 'ing', label: 'Inglês' },
    ];

    // Scroll automático ao adicionar mensagem
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const toggleSubject = (id) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const startSession = () => {
        if (selectedSubjects.length === 0) return;
        setStep('chat');
        setPopupOpen(true);
        const subjectNames = subjects.filter(s => selectedSubjects.includes(s.id)).map(s => s.label).join(', ');
        setTimeout(() => {
            setMessages([{
                role: 'assistant',
                content: `Olá! Vejo que você quer estudar **${subjectNames}**. Como posso te ajudar? Posso criar um resumo, fazer perguntas ou explicar um tópico específico.`
            }]);
        }, 500);
    };

    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const aiResponse = await askChatGPT(inputValue, api);
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar com a IA.' }]);
        }
        setIsTyping(false);
    };

    const reset = () => {
        setStep('selection');
        setMessages([]);
        setPopupOpen(false);
    };

    return (
        <>
            {!popupOpen && (
                <Card className="w-full h-full flex flex-col bg-slate-900 border border-slate-800 shadow-2xl shadow-purple-900/20 group rounded-xl overflow-hidden">
                    <CardHeader className="pb-3 bg-slate-950/30">
                        <CardTitle className="text-xl text-white">Estudo Personalizado</CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                            {step === 'selection' ? 'Selecione as matérias de hoje' : 'Sessão de estudo ativa'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 flex flex-col min-h-[300px] relative overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {subjects.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => toggleSubject(sub.id)}
                                    className={`p-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${selectedSubjects.includes(sub.id)
                                        ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/20'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                                        }`}
                                >
                                    {sub.label}
                                    {selectedSubjects.includes(sub.id) && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={selectedSubjects.length === 0}
                            onClick={startSession}
                        >
                            Começar Sessão <BookOpen className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {popupOpen && (
                <Rnd
                    size={popupSize}
                    position={popupPos}
                    onDragStop={(e, d) => setPopupPos({ x: d.x, y: d.y })}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        setPopupSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                        setPopupPos(position);
                    }}
                    minWidth={350}
                    minHeight={400}
                    style={{ zIndex: 1000 }}
                >
                    <Card className="w-full h-full flex flex-col bg-slate-900 border border-slate-800 shadow-2xl shadow-purple-900/20 group rounded-xl overflow-hidden">
                        <CardHeader className="pb-3 bg-slate-950/30 flex justify-between items-center">
                            <CardTitle className="text-xl text-white">Estudo Personalizado</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={reset}>×</Button>
                                <Button variant="ghost" size="icon" onClick={() => { }}> <Bot className="w-5 h-5 text-purple-400" /> </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/20"
                                    ref={scrollRef}
                                >
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                ? 'bg-purple-600 text-white rounded-tr-none'
                                                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                                                }`}
                                            >
                                                {msg.role === 'assistant' && <Bot className="w-3 h-3 mb-1 text-purple-400 inline mr-2" />}
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2 border border-slate-700 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75" />
                                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                                <Input
                                    placeholder="Digite sua dúvida..."
                                    className="bg-slate-800 border-slate-700 text-white h-9 text-xs flex-1"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                                />
                                <Button size="icon" type="button" className="h-9 w-9 bg-purple-600 hover:bg-purple-700" onClick={handleSendMessage}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Rnd>
            )}
        </>
    );
};

export default CustomStudyArea;
