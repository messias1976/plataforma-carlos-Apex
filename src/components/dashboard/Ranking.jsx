import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Clock, Medal } from 'lucide-react';

const MOCK_RANKING = [
  { id: 1, name: "Alice Skywalker", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", level: 42, xp: 45200, time: 320, accuracy: 98 },
  { id: 2, name: "John Wick", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", level: 38, xp: 38900, time: 280, accuracy: 95 },
  { id: 3, name: "Sarah Connor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", level: 35, xp: 35100, time: 250, accuracy: 92 },
  { id: 4, name: "Neo Anderson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neo", level: 30, xp: 29000, time: 200, accuracy: 99 },
  { id: 5, name: "Ellen Ripley", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ellen", level: 28, xp: 27500, time: 180, accuracy: 94 },
  { id: 6, name: "Marty McFly", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marty", level: 25, xp: 24000, time: 160, accuracy: 88 },
];

const Ranking = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 min-h-[500px]">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('ranking.title')}</h2>
        <p className="text-slate-400">{t('ranking.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-5">{t('ranking.student')}</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-2 text-center">Lvl</div>
          <div className="col-span-2 text-center">%</div>
        </div>

        {MOCK_RANKING.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl border transition-all ${
              index === 0 
                ? 'bg-yellow-900/20 border-yellow-500/50 shadow-lg shadow-yellow-900/20' 
                : index === 1
                ? 'bg-slate-800/50 border-slate-500/50'
                : index === 2
                ? 'bg-orange-900/20 border-orange-500/50'
                : 'bg-slate-900/30 border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <div className="col-span-1 font-bold text-lg text-slate-400 flex items-center justify-center">
              {index === 0 ? <CrownIcon color="text-yellow-400" /> : 
               index === 1 ? <CrownIcon color="text-slate-300" /> :
               index === 2 ? <CrownIcon color="text-orange-400" /> :
               index + 1}
            </div>
            
            <div className="col-span-5 flex items-center gap-3">
              <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700" />
              <div>
                <p className={`font-bold ${index < 3 ? 'text-white' : 'text-slate-300'}`}>{student.name}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" /> {student.time}m
                </div>
              </div>
            </div>

            <div className="col-span-2 text-center font-mono text-emerald-400 font-bold">
              {student.xp.toLocaleString()}
            </div>

            <div className="col-span-2 text-center font-bold text-slate-300">
              <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{student.level}</span>
            </div>

            <div className="col-span-2 text-center font-bold text-blue-400">
              {student.accuracy}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CrownIcon = ({ color }) => (
  <Medal className={`w-6 h-6 ${color}`} />
);

export default Ranking;