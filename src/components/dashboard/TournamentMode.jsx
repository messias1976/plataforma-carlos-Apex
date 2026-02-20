
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Swords, Trophy, Shield, Zap, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TournamentMode = () => {
  const { user, addXP, addCoins } = useAuth();
  const { t } = useLanguage();
  const [gameState, setGameState] = useState('idle'); // idle, searching, battling, result
  const [opponent, setOpponent] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [logs, setLogs] = useState([]);

  // Mock opponents
  const opponents = [
    { name: "CyberStudent_99", level: (user?.level || 1) + 1 },
    { name: "NeonScholar", level: Math.max(1, (user?.level || 1) - 1) },
    { name: "ApexLegend", level: (user?.level || 1) + 2 },
  ];

  const startSearch = () => {
    setGameState('searching');
    setTimeout(() => {
      setOpponent(opponents[Math.floor(Math.random() * opponents.length)]);
      setGameState('battling');
      setTimer(10);
      setPlayerScore(0);
      setOpponentScore(0);
      setLogs([]);
    }, 2500);
  };

  useEffect(() => {
    let interval;
    if (gameState === 'battling' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);

        // Simulate scoring events
        if (Math.random() > 0.3) {
          const points = Math.floor(Math.random() * 20) + 10;
          setPlayerScore(prev => prev + points);
          setLogs(prev => [`You hit a combo! +${points} pts`, ...prev.slice(0, 4)]);
        }
        if (Math.random() > 0.4) {
          const points = Math.floor(Math.random() * 20) + 10;
          setOpponentScore(prev => prev + points);
        }

      }, 1000);
    } else if (gameState === 'battling' && timer === 0) {
      setGameState('result');
      if (playerScore > opponentScore) {
        // Safety check for addXP
        if (typeof addXP === 'function') {
          addXP(200);
        } else {
          console.warn("addXP is not available in AuthContext");
        }

        // Safety check for addCoins
        if (typeof addCoins === 'function') {
          addCoins(50);
        } else {
          console.warn("addCoins is not available in AuthContext");
        }
      } else if (playerScore === opponentScore) {
        // Safety check for addXP
        if (typeof addXP === 'function') {
          addXP(50);
        }

        // Safety check for addCoins
        if (typeof addCoins === 'function') {
          addCoins(10);
        }
      }
    }
    return () => clearInterval(interval);
  }, [gameState, timer, addXP, addCoins, playerScore, opponentScore]);

  return (
    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden min-h-[500px] flex flex-col justify-center items-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 blur-[100px] rounded-full" />
      </div>

      <AnimatePresence mode='wait'>
        {gameState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center z-10"
          >
            <Swords className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">{t('tournament.title')}</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">{t('tournament.subtitle')}</p>
            <Button
              onClick={startSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <Zap className="w-5 h-5 mr-2" />
              {t('tournament.find')}
            </Button>
          </motion.div>
        )}

        {gameState === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping" />
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent" />
              <User className="absolute inset-0 m-auto w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white animate-pulse">{t('tournament.searching')}</h3>
          </motion.div>
        )}

        {(gameState === 'battling' || gameState === 'result') && (
          <motion.div
            key="battle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl z-10"
          >
            {/* Header / Timer */}
            <div className="text-center mb-8">
              <div className="text-4xl font-mono font-bold text-white mb-2">{timer}s</div>
              <div className="text-sm text-slate-400 uppercase tracking-widest">{gameState === 'result' ? 'FINISHED' : 'BATTLE IN PROGRESS'}</div>
            </div>

            {/* Battle Arena */}
            <div className="flex justify-between items-center gap-4 mb-12">
              {/* Player */}
              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-emerald-600 rounded-full mx-auto mb-4 border-4 border-slate-900 shadow-lg flex items-center justify-center">
                  <span className="text-2xl">😎</span>
                </div>
                <h3 className="font-bold text-white mb-1">You</h3>
                <div className="text-3xl font-bold text-emerald-400">{playerScore}</div>
                <Progress value={Math.min(100, playerScore)} className="h-2 mt-2" indicatorClassName="bg-emerald-500" />
              </div>

              {/* VS */}
              <div className="text-2xl font-black text-slate-600 italic">VS</div>

              {/* Opponent */}
              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 border-4 border-slate-900 shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold text-white mb-1">{opponent?.name}</h3>
                <div className="text-3xl font-bold text-red-400">{opponentScore}</div>
                <Progress value={Math.min(100, opponentScore)} className="h-2 mt-2" indicatorClassName="bg-red-500" />
              </div>
            </div>

            {/* Logs */}
            <div className="bg-slate-900/80 rounded-lg p-4 h-32 overflow-hidden border border-emerald-500/10 mb-6">
              <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">{t('tournament.battle')}</h4>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-emerald-300 font-mono">
                    {`> ${log}`}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Result Overlay */}
            {gameState === 'result' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
              >
                {playerScore > opponentScore ? (
                  <>
                    <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                    <h2 className="text-4xl font-bold text-yellow-400 mb-2">{t('tournament.win')}</h2>
                    <p className="text-white mb-6">+200 XP | +50 Coins</p>
                  </>
                ) : playerScore < opponentScore ? (
                  <>
                    <Shield className="w-20 h-20 text-red-400 mb-4" />
                    <h2 className="text-4xl font-bold text-red-400 mb-2">{t('tournament.loss')}</h2>
                    <p className="text-white mb-6">Try harder next time!</p>
                  </>
                ) : (
                  <h2 className="text-4xl font-bold text-slate-300 mb-6">{t('tournament.draw')}</h2>
                )}

                <Button onClick={() => setGameState('idle')} className="bg-white text-slate-900 hover:bg-slate-200">
                  Play Again
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentMode;
