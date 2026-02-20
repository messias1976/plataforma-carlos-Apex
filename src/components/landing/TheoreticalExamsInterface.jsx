
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, FileText, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/MockAuthContext';

const TheoreticalExamsInterface = ({ isOpen, onClose }) => {
    const { api } = useAuth();
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [exam, setExam] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { 0: 1, 1: 2 } (questionIdx: optionIdx)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        setExam(null);
        setSelectedAnswers({});
        setIsSubmitted(false);

        try {
            const data = await api('/ai/generate-exam', {
                method: "POST",
                body: JSON.stringify({
                    disciplina: subject,
                    tema: topic,
                    nivel: difficulty || "médio"
                })
            });

            let examPayload = data?.data || data;
            if (data && typeof data.reply === 'string') {
                try {
                    examPayload = JSON.parse(data.reply);
                } catch (err) {
                    examPayload = null;
                }
            } else if (data?.data && typeof data.data.reply === 'string') {
                try {
                    examPayload = JSON.parse(data.data.reply);
                } catch (err) {
                    examPayload = null;
                }
            }

            if (examPayload && examPayload.questions && Array.isArray(examPayload.questions)) {
                // Adaptar para o formato esperado pelo componente
                const newExam = examPayload.questions.map(q => ({
                    q: q.question,
                    options: q.options,
                    correct: q.correct
                }));
                setExam(newExam);
            } else {
                setExam([]);
                toast({ title: "Erro IA", description: "A IA não retornou questões válidas.", variant: "destructive" });
            }
        } catch (err) {
            setExam([]);
            toast({ title: "Erro IA", description: "Não foi possível gerar questões.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (qIndex, optionIndex) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [qIndex]: optionIndex
        }));
    };

    const handleSubmit = () => {
        if (Object.keys(selectedAnswers).length < (exam?.length || 0)) {
            toast({ title: "Atenção", description: "Responda todas as questões antes de finalizar.", variant: "destructive" });
            return;
        }
        setIsSubmitted(true);
        toast({ title: "Prova Finalizada", description: "Confira seu gabarito abaixo.", className: "bg-green-600 text-white" });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-slate-950 border-slate-700 text-white p-0 gap-0 overflow-hidden flex flex-col h-[85vh] md:h-[80vh]" aria-describedby="theoretical-exams-desc">
                <DialogTitle className="sr-only">Interface de Provas Teóricas</DialogTitle>
                <DialogDescription id="theoretical-exams-desc" className="sr-only">
                    Modal de realização de provas teóricas. Responda as questões e confira seu desempenho.
                </DialogDescription>

                {/* Header */}
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                                Gerador de Provas <Sparkles className="w-3 h-3 text-blue-400" />
                            </h3>
                            <p className="text-xs text-slate-400">Avaliação instantânea com IA</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-800 text-slate-400">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1 flex flex-col overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-9">
                                <SelectValue placeholder="Disciplina" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="matematica">Matemática</SelectItem>
                                <SelectItem value="historia">História</SelectItem>
                                <SelectItem value="fisica">Física</SelectItem>
                                <SelectItem value="biologia">Biologia</SelectItem>
                                <SelectItem value="portugues">Português</SelectItem>
                                <SelectItem value="geral">Geral</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-9">
                                <SelectValue placeholder="Dificuldade" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="facil">Fácil</SelectItem>
                                <SelectItem value="medio">Médio</SelectItem>
                                <SelectItem value="dificil">Difícil</SelectItem>
                                <SelectItem value="enem">Estilo ENEM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <Input
                            placeholder="Digite o tema (ex: Revolução Industrial)"
                            className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={!topic.trim() || isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerar Prova"}
                        </Button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-slate-950/30 rounded-xl border border-slate-800 flex-1 relative overflow-hidden flex flex-col">
                        {!exam && !isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2 p-6 text-center">
                                <FileText className="w-12 h-12 opacity-20" />
                                <p className="text-sm">Configure os parâmetros acima e clique em "Gerar Prova" para começar.</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400 z-10 bg-slate-950/50 backdrop-blur-sm">
                                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                                <span className="text-sm font-medium animate-pulse">IA elaborando questões inéditas...</span>
                            </div>
                        )}

                        <ScrollArea className="flex-1 p-4 h-full w-full">
                            <AnimatePresence>
                                {exam && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6 pb-4"
                                    >
                                        <div className="border-b border-slate-800 pb-4 mb-4">
                                            <h2 className="text-lg md:text-xl font-bold text-white capitalize">{topic}</h2>
                                            <div className="flex gap-2 mt-2">
                                                {subject && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded capitalize">{subject}</span>}
                                                {difficulty && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded capitalize">{difficulty}</span>}
                                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">5 Questões</span>
                                            </div>
                                        </div>

                                        {exam.map((question, qIdx) => (
                                            <div key={qIdx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                                                <h4 className="font-medium text-slate-200 mb-4 flex gap-3">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-500/20 text-blue-400 text-sm font-bold shrink-0">{qIdx + 1}</span>
                                                    {question.q}
                                                </h4>
                                                <div className="space-y-2 pl-9">
                                                    {question.options.map((opt, optIdx) => {
                                                        const isSelected = selectedAnswers[qIdx] === optIdx;
                                                        const isCorrect = isSubmitted && question.correct === optIdx;
                                                        const isWrong = isSubmitted && isSelected && !isCorrect;

                                                        let itemClass = "flex items-center gap-3 text-sm p-3 rounded-lg border transition-all cursor-pointer group ";

                                                        if (isSubmitted) {
                                                            if (isCorrect) itemClass += "bg-green-500/10 border-green-500/50 text-green-100";
                                                            else if (isWrong) itemClass += "bg-red-500/10 border-red-500/50 text-red-100";
                                                            else itemClass += "bg-slate-800/30 border-transparent text-slate-500 opacity-50";
                                                        } else {
                                                            if (isSelected) itemClass += "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.2)]";
                                                            else itemClass += "bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800 hover:border-slate-700 hover:text-slate-200";
                                                        }

                                                        return (
                                                            <div
                                                                key={optIdx}
                                                                onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                                className={itemClass}
                                                            >
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600 group-hover:border-slate-500'
                                                                    } ${isSubmitted && isCorrect ? '!bg-green-500 !border-green-500' : ''} ${isSubmitted && isWrong ? '!bg-red-500 !border-red-500' : ''}`}>
                                                                    {(isSelected || (isSubmitted && isCorrect)) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                                </div>
                                                                {opt}
                                                                {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />}
                                                                {isSubmitted && isWrong && <AlertCircle className="w-4 h-4 ml-auto text-red-500" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-4 flex justify-end sticky bottom-0 bg-gradient-to-t from-slate-900 to-transparent pb-2">
                                            {!isSubmitted ? (
                                                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar Prova
                                                </Button>
                                            ) : (
                                                <div className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700">
                                                    Prova Finalizada • Confira os resultados acima
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TheoreticalExamsInterface;
