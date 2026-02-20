import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flame, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const StudyTimer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [dailyTime, setDailyTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (user) {
      const storageKey = `apex_timer_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toDateString();

        if (data.lastDate === today) {
          setDailyTime(data.dailyTime || 0);
        } else {
          setDailyTime(0);
          if (data.lastDate === new Date(Date.now() - 86400000).toDateString()) {
            setStreak(data.streak || 0);
          } else {
            setStreak(0);
          }
        }

        setTotalTime(data.totalTime || 0);
        setStreak(data.streak || 0);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
        setDailyTime(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (user && (dailyTime > 0 || totalTime > 0)) {
      const storageKey = `apex_timer_${user.id}`;
      const today = new Date().toDateString();

      const stored = localStorage.getItem(storageKey);
      let currentStreak = streak;

      if (stored) {
        const data = JSON.parse(stored);
        if (data.lastDate !== today && dailyTime > 0) {
          if (data.lastDate === new Date(Date.now() - 86400000).toDateString()) {
            currentStreak = (data.streak || 0) + 1;
          } else {
            currentStreak = 1;
          }
          setStreak(currentStreak);
        }
      } else if (dailyTime > 0) {
        currentStreak = 1;
        setStreak(1);
      }

      localStorage.setItem(storageKey, JSON.stringify({
        dailyTime,
        totalTime,
        streak: currentStreak,
        lastDate: today
      }));
    }
  }, [dailyTime, totalTime, user]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast({
        title: t('timer.started'),
        description: t('timer.focusMsg'),
      });
    } else {
      toast({
        title: t('timer.paused'),
        description: t('timer.breakMsg'),
      });
    }
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
    toast({
      title: t('timer.reset'),
      description: "Session timer has been reset",
    });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-500/10 p-6 sm:p-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-8">{t('timer.title')}</h2>

        {/* Main Timer Display */}
        <motion.div
          className="relative mb-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <motion.div
              className="text-5xl sm:text-7xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"
              animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
            >
              {formatTime(seconds)}
            </motion.div>
            <p className="text-center text-slate-400 text-sm mt-2">{t('timer.session')}</p>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={handleStartPause}
            className={`px-8 py-6 text-lg font-semibold transition-all ${isRunning
                ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
              }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                {t('timer.pause')}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {t('timer.start')}
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-6 py-6 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500 text-emerald-400"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 text-center"
          >
            <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formatTime(dailyTime)}</p>
            <p className="text-sm text-slate-400">{t('timer.today')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 text-center"
          >
            <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formatTime(totalTime)}</p>
            <p className="text-sm text-slate-400">{t('timer.total')}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4 text-center"
          >
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{streak}</p>
            <p className="text-sm text-slate-400">{t('timer.streak')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;