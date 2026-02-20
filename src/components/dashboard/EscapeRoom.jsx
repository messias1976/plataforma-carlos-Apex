import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock, Unlock, Key, ArrowRight, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EscapeRoom = () => {
  const { addXP, addCoins } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showClue, setShowClue] = useState(false);

  // Define rooms using t() inside component or use keys to access t() dynamically
  // Since we need to access t(), we construct the data inside the component render
  const ROOMS = [
    {
      id: 1,
      title: t('escape.rooms.0.title'),
      description: t('escape.rooms.0.desc'),
      clue: t('escape.rooms.0.clue'),
      answer: "e",
      image: "https://images.unsplash.com/photo-1507842217121-9d5961143694?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: t('escape.rooms.1.title'),
      description: t('escape.rooms.1.desc'),
      clue: t('escape.rooms.1.clue'),
      answer: "7",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const currentRoom = ROOMS[currentRoomIndex];

  const handleUnlock = () => {
    if (inputCode.toLowerCase().trim() === currentRoom.answer.toLowerCase()) {
      setIsUnlocked(true);
      addXP(150);
      addCoins(30);
      toast({
        title: t('escape.success'),
        className: "bg-emerald-500 text-white border-none"
      });
    } else {
      toast({
        title: t('escape.fail'),
        variant: "destructive"
      });
    }
  };

  const nextRoom = () => {
    if (currentRoomIndex < ROOMS.length - 1) {
      setCurrentRoomIndex(prev => prev + 1);
      setIsUnlocked(false);
      setInputCode('');
      setShowClue(false);
    } else {
      // Finished all rooms
      toast({
        title: t('escape.completed'),
        className: "bg-emerald-500 text-white border-none"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
      {/* Visual Side */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 group">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <img
          src={currentRoom.image}
          alt={currentRoom.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 p-6 z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-1 rounded uppercase">{t('escape.room')} {currentRoom.id}</span>
            {isUnlocked ? (
              <span className="flex items-center text-emerald-400 text-xs font-bold gap-1"><Unlock className="w-3 h-3" /> {t('escape.unlocked')}</span>
            ) : (
              <span className="flex items-center text-red-400 text-xs font-bold gap-1"><Lock className="w-3 h-3" /> {t('escape.locked')}</span>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white">{currentRoom.title}</h2>
        </div>
      </div>

      {/* Puzzle Side */}
      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 flex flex-col justify-center">
        {!isUnlocked ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <p className="text-lg text-slate-300 leading-relaxed font-serif italic">
              "{currentRoom.description}"
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder={t('escape.inputPlaceholder')}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Button onClick={handleUnlock} className="bg-emerald-600 hover:bg-emerald-700">
                  {t('escape.unlock')}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClue(!showClue)}
                  className="text-slate-400 hover:text-yellow-400"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showClue ? t('escape.hideHint') : t('escape.hint')}
                </Button>
              </div>

              {showClue && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-yellow-900/20 border border-yellow-500/20 p-3 rounded text-sm text-yellow-200">
                  <span className="font-bold">{t('escape.clue')}:</span> {currentRoom.clue}
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <Key className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{t('escape.success')}</h3>
            <p className="text-slate-400">Passage to the next sector granted.</p>
            <Button onClick={nextRoom} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
              {t('escape.nextRoom')} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EscapeRoom;