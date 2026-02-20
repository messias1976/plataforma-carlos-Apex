import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/MockAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sword, Trophy, Home } from 'lucide-react';

const QUESTIONS = [
    { q: 'Qual é a capital do Brasil?', opts: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Salvador'], ans: 1, cat: 'Geografia' },
    { q: 'Quanto é 15 + 27?', opts: ['42', '40', '38', '45'], ans: 0, cat: 'Matemática' },
    { q: 'Qual planeta é o maior?', opts: ['Saturno', 'Júpiter', 'Netuno', 'Urano'], ans: 1, cat: 'Ciências' },
    { q: 'Em que ano terminou WWII?', opts: ['1943', '1944', '1945', '1946'], ans: 2, cat: 'História' },
    { q: 'Qual é o maior oceano?', opts: ['Atlântico', 'Pacífico', 'Índico', 'Ártico'], ans: 1, cat: 'Geografia' }
];

const AI_NAMES = ['IA Master', 'Robo Scholar', 'Genius Bot'];
const AI_AVATARS = ['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gracie'];

export default function BattleMode() {
    const { user } = useAuth();
    const [state, setState] = useState('menu');
    const [mode, setMode] = useState(null);
    const [q, setQ] = useState(0);
    const [score, setScore] = useState(0);
    const [opScore, setOpScore] = useState(0);
    const [ans, setAns] = useState(null);
    const [opAns, setOpAns] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [opThinking, setOpThinking] = useState(false);
    const [opName, setOpName] = useState('IA Master');
    const [opAvatar, setOpAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');

    const playerAvatar = user?.email ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=player';

    const startBattle = (m) => {
        setMode(m);
        setState('battle');
        setQ(0);
        setScore(0);
        setOpScore(0);
        setAns(null);
        setOpAns(null);
        setAnswered(false);
        if (m === 'bot') {
            const idx = Math.floor(Math.random() * AI_NAMES.length);
            setOpName(AI_NAMES[idx]);
            setOpAvatar(AI_AVATARS[idx]);
        }
    };

    const handleAnswer = (i) => {
        if (answered) return;
        setAns(i);
        setAnswered(true);
        if (i === QUESTIONS[q].ans) setScore(s => s + 1);

        if (mode === 'bot') {
            setOpThinking(true);
            setTimeout(() => {
                const correct = Math.random() > 0.4;
                const opIdx = correct ? QUESTIONS[q].ans : Math.floor(Math.random() * 4);
                setOpAns(opIdx);
                if (correct) setOpScore(s => s + 1);
                setOpThinking(false);
                setTimeout(() => {
                    if (q < 4) {
                        setQ(q + 1);
                        setAns(null);
                        setOpAns(null);
                        setAnswered(false);
                    } else {
                        setState('result');
                    }
                }, 2000);
            }, 1500);
        } else {
            setTimeout(() => {
                if (q < 4) {
                    setQ(q + 1);
                    setAns(null);
                    setOpAns(null);
                    setAnswered(false);
                } else {
                    setState('result');
                }
            }, 1500);
        }
    };

    // Menu
    if (state === 'menu') {
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-neon-500 mb-3 flex items-center justify-center gap-3">
                        <Sword className="w-10 h-10" /> Batalha 1x1
                    </h2>
                    <p className="text-slate-400 text-lg">Desafie em duelos de conhecimento</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startBattle('bot')} className="cursor-pointer">
                        <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900/50 border-purple-500/40 hover:border-purple-400 transition-all h-full">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <div className="text-7xl mb-4">👨‍🏫</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Desafie a IA</h3>
                                    <p className="text-slate-400 mb-6">Compete contra um oponente inteligente</p>
                                    <Button className="w-full bg-purple-600 hover:bg-purple-700 py-6 font-bold">Começar</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startBattle('player')} className="cursor-pointer">
                        <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/50 border-blue-500/40 hover:border-blue-400 transition-all h-full">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <div className="text-7xl mb-4">👥</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Multiplayer</h3>
                                    <p className="text-slate-400 mb-6">Desafie um jogador</p>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 font-bold">Começar</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Battle
    if (state === 'battle') {
        const curr = QUESTIONS[q];
        return (
            <div className="space-y-6">
                <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <motion.div initial={{ x: -50 }} animate={{ x: 0 }} className="flex-1 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neon-500">
                                        <img src={playerAvatar} alt="You" className="w-full h-full" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{user?.email?.split('@')[0] || 'Você'}</p>
                                        <p className="text-4xl font-black text-neon-500">{score}</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="px-6">
                                <Sword className="w-10 h-10 text-yellow-500" />
                            </motion.div>
                            <motion.div initial={{ x: 50 }} animate={{ x: 0 }} className="flex-1 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500">
                                        <img src={opAvatar} alt="Op" className="w-full h-full" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{opName}</p>
                                        <p className="text-4xl font-black text-purple-400">{opScore}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-3 mb-3">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${((q + 1) / 5) * 100}%` }} className="bg-gradient-to-r from-neon-500 to-neon-400 h-3 rounded-full" />
                        </div>
                        <p className="text-center text-slate-400 text-sm">{q + 1} de 5</p>
                    </CardContent>
                </Card>
                <AnimatePresence>
                    <motion.div key={q} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-8">
                                <span className="text-xs font-bold text-neon-500 bg-neon-500/10 px-3 py-1 rounded-full">{curr.cat}</span>
                                <h3 className="text-3xl font-bold text-white mt-4 mb-8">{curr.q}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {curr.opts.map((opt, i) => (
                                        <motion.button key={i} onClick={() => handleAnswer(i)} disabled={answered} whileHover={{ scale: answered ? 1 : 1.02 }} className={`p-6 rounded-lg font-bold text-left transition-all ${ans === i ? i === curr.ans ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-red-500/20 border-2 border-red-500 text-red-400' : answered && i === curr.ans ? 'bg-green-500/10 border-2 border-green-500 text-green-400' : 'bg-slate-800/50 border-2 border-slate-700 text-slate-300 hover:bg-slate-800'} ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 flex items-center justify-center font-black text-xl rounded-lg ${ans === i ? 'bg-current' : 'bg-slate-700'}`}>{String.fromCharCode(65 + i)}</div>
                                                <span>{opt}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        {answered && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className={`border ${ans === curr.ans ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <CardContent className="p-6">
                                        <p className="text-white font-bold mb-3">Sua resposta:</p>
                                        <p className={`text-lg font-semibold ${ans === curr.ans ? 'text-green-400' : 'text-red-400'}`}>{curr.opts[ans]}</p>
                                        <p className="text-xs mt-2 text-slate-400">{ans === curr.ans ? '✓ Correto!' : '✗ Incorreto'}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-purple-900/20 border-purple-500/30">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <img src={opAvatar} alt="Op" className="w-8 h-8 rounded-full" onError={(e) => e.target.style.display = 'none'} />
                                            <p className="text-white font-bold">{opName}</p>
                                        </div>
                                        {opThinking ? (
                                            <motion.div className="flex gap-2">
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 rounded-full bg-purple-500" />
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-purple-500" />
                                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-purple-500" />
                                            </motion.div>
                                        ) : (
                                            <>
                                                <p className="text-white font-bold mb-3">Resposta:</p>
                                                <p className={`text-lg font-semibold ${opAns === curr.ans ? 'text-green-400' : 'text-red-400'}`}>{curr.opts[opAns]}</p>
                                                <p className="text-xs mt-2 text-slate-400">{opAns === curr.ans ? '✓ Correto!' : '✗ Incorreto'}</p>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Result
    const win = score > opScore;
    const draw = score === opScore;
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
                <CardContent className="p-12">
                    <div className="text-center mb-8">
                        <div className="text-7xl mb-4">{win ? '🎉' : draw ? '🤝' : '😢'}</div>
                        <h2 className={`text-5xl font-black mb-2 ${win ? 'text-yellow-500' : draw ? 'text-slate-400' : 'text-slate-500'}`}>{win ? 'Você Venceu!' : draw ? 'Empate!' : 'Você Perdeu'}</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center p-6 bg-neon-500/10 border border-neon-500/30 rounded-lg">
                            <p className="text-slate-400 text-sm mb-2">Seus Pontos</p>
                            <p className="text-5xl font-black text-neon-500">{score}</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="text-center p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
                            <p className="text-slate-400 text-sm mb-2">Oponente</p>
                            <p className="text-5xl font-black text-purple-400">{opScore}</p>
                        </div>
                    </div>
                    {win && (<motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg mb-8">
                        <p className="text-green-400 font-black text-center text-lg">✨ +50 XP e +200 Moedas!</p>
                    </motion.div>)}
                    <div className="flex gap-4">
                        <Button onClick={() => startBattle(mode)} className="flex-1 bg-neon-500 hover:bg-neon-600 text-slate-950 font-bold py-6 text-base">
                            <Sword className="w-5 h-5 mr-2" /> Novamente
                        </Button>
                        <Button onClick={() => setState('menu')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-6 text-base">
                            <Home className="w-5 h-5 mr-2" /> Menu
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
