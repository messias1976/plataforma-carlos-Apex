import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, BookOpen, Trophy, Target, Award, Brain, Sword, AlertTriangle, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const StudentProfile = () => {
  const { user, addXP, addCoins, updateUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const xpForNextLevel = 1000;
  const safeXP = Number.isFinite(user?.xp) ? user.xp : 0;
  const safeLevel = Number.isFinite(user?.level) ? user.level : 1;
  const safeStreak = Number.isFinite(user?.streak) ? user.streak : 0;
  const currentLevelProgress = ((safeXP % xpForNextLevel) / xpForNextLevel) * 100;

  const handleMissionComplete = (missionId) => {
    if (!user) return;

    const missionIndex = user.missions.findIndex(m => m.id === missionId);
    if (missionIndex === -1 || user.missions[missionIndex].completed) return;

    const mission = user.missions[missionIndex];
    addXP(mission.xp);
    addCoins(mission.coins);

    const updatedMissions = [...user.missions];
    updatedMissions[missionIndex] = { ...mission, completed: true };
    updateUser({ missions: updatedMissions });

    toast({
      title: t('profile.missionCompleted'),
      description: `+${mission.xp} XP | +${mission.coins} Coins`,
      className: "bg-emerald-500 text-white border-none"
    });
  };

  const planName = user?.subscription?.plan === 'free' ? t('subscription.free.name') :
    user?.subscription?.plan === 'plan1' ? t('subscription.plan1.name') :
      t('subscription.plan2.name');

  const expiryDate = user?.subscription?.trialEndsAt ? new Date(user.subscription.trialEndsAt).toLocaleDateString() : '--';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Character Stats */}
      <div className="space-y-6">
        <motion.div
          className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden"
          whileHover={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-32 h-32 text-emerald-500" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl shadow-emerald-500/20">
              <span className="text-3xl font-bold text-white">{safeLevel}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t('profile.rank')}</h2>
              <p className="text-emerald-400 font-mono">Novice Scholar</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{t('profile.xp')}</span>
              <span className="text-emerald-400">{safeXP % xpForNextLevel} / {xpForNextLevel} XP</span>
            </div>
            <Progress value={currentLevelProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">{t('profile.intelligence')}</span>
              </div>
              <p className="text-xl font-bold text-white">{(safeLevel * 5) + 10}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">{t('profile.focus')}</span>
              </div>
              <p className="text-xl font-bold text-white">{(safeStreak * 2) + 10}%</p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Status Widget */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-emerald-500/20 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
            <CreditCard className="w-5 h-5" /> {t('profile.subscription')}
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">{t('profile.currentPlan')}</span>
            <span className="text-white font-bold bg-emerald-900/40 px-3 py-1 rounded border border-emerald-500/20">{planName}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 text-sm">{t('profile.expires')}</span>
            <span className="text-white font-mono text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {expiryDate}</span>
          </div>
          <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
            {t('profile.upgrade')}
          </Button>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
              <Sword className="w-4 h-4" /> {t('profile.strengths')}
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {t('profile.consist')}</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {t('profile.quick')}</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 border border-red-500/20 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-red-400 font-bold mb-3">
              <AlertTriangle className="w-4 h-4" /> {t('profile.weaknesses')}
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {t('profile.late')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Missions & Subject Evolution */}
      <div className="space-y-6">
        {/* Daily Missions */}
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> {t('profile.missions')}
          </h3>
          <div className="space-y-3">
            {user?.missions?.map((mission) => (
              <div key={mission.id} className="flex items-center justify-between bg-slate-800/40 p-3 rounded-lg border border-emerald-500/10">
                <div>
                  <p className={`text-sm font-medium ${mission.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {mission.title}
                  </p>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className="text-purple-400">+{mission.xp} XP</span>
                    <span className="text-yellow-400">+{mission.coins} Coins</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={mission.completed ? "ghost" : "default"}
                  className={mission.completed ? "text-emerald-500" : "bg-emerald-600 hover:bg-emerald-700"}
                  onClick={() => handleMissionComplete(mission.id)}
                  disabled={mission.completed}
                >
                  {mission.completed ? t('profile.done') : t('profile.claim')}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Evolution */}
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> {t('profile.mastery')}
          </h3>
          <div className="space-y-4">
            {Object.entries(user?.subjectProgress || {}).map(([subject, value]) => (
              <div key={subject}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{subject}</span>
                  <span className="text-emerald-400">{value}%</span>
                </div>
                <Progress value={value} className="h-1.5 bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;