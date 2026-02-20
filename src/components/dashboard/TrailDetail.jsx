import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Lock, PlayCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrails } from '@/contexts/TrailsContext';
import LessonPlayer from './LessonPlayer';
import { Progress } from '@/components/ui/progress';

const TrailDetail = ({ trailId, onBack }) => {
  const { t } = useLanguage();
  const { getTrailDetails, currentTrail, setCurrentTrail, markLessonComplete } = useTrails();
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getTrailDetails(trailId);
      setCurrentTrail(data);
      setLoading(false);
    };
    loadData();
  }, [trailId]);

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;
  if (!currentTrail) return <div className="p-8 text-center text-red-400">{t('common.error')}</div>;

  // Flatten lessons for navigation
  const allLessons = currentTrail.modules.flatMap(m => m.lessons || []);
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(l => l.lesson_progress?.[0]?.completed).length;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleLessonComplete = async (lessonId) => {
    await markLessonComplete(lessonId);
    if (activeLessonIndex < allLessons.length - 1) {
        setActiveLesson(allLessons[activeLessonIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-slate-950/50 rounded-3xl overflow-hidden border border-slate-800">
      {activeLesson ? (
        <div className="flex flex-col h-full">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center gap-4">
                <Button variant="ghost" onClick={() => setActiveLesson(null)} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {t('trails.modules')}
                </Button>
                <h3 className="font-bold text-white truncate flex-1">{currentTrail.title}</h3>
                <div className="w-32">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <LessonPlayer 
                    lesson={activeLesson}
                    onComplete={handleLessonComplete}
                    onNext={() => setActiveLesson(allLessons[activeLessonIndex + 1])}
                    onPrev={() => setActiveLesson(allLessons[activeLessonIndex - 1])}
                    hasNext={activeLessonIndex < allLessons.length - 1}
                    hasPrev={activeLessonIndex > 0}
                />
            </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar Info */}
            <div className="md:w-1/3 p-6 bg-slate-900/80 border-r border-slate-800 flex flex-col">
                <Button variant="ghost" onClick={onBack} className="self-start mb-6 text-slate-400 -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back')}
                </Button>
                
                <h1 className="text-2xl font-bold text-white mb-2">{currentTrail.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        currentTrail.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        currentTrail.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                    }`}>
                        {t(`trails.${currentTrail.difficulty}`)}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{currentTrail.modules_count} {t('trails.modules')}</span>
                </div>
                
                <p className="text-slate-400 mb-8 flex-1">{currentTrail.description}</p>
                
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-white">{t('trails.myProgress')}</span>
                        <span className="text-neon-400 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-slate-700" indicatorClassName="bg-neon-500" />
                </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 bg-slate-950/30 p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t('trails.modules')}</h2>
                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                        {currentTrail.modules.map((module, index) => (
                            <div key={module.id} className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                                <div className="p-4 bg-slate-800/40 border-b border-slate-800/50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-200">
                                        <span className="text-neon-500 mr-2">{index + 1}.</span>
                                        {module.title}
                                    </h3>
                                </div>
                                <div className="p-2">
                                    {module.lessons.map((lesson, lIndex) => {
                                        const isCompleted = lesson.lesson_progress?.[0]?.completed;
                                        return (
                                            <motion.div 
                                                key={lesson.id}
                                                whileHover={{ x: 4 }}
                                                onClick={() => setActiveLesson(lesson)}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                    activeLesson?.id === lesson.id ? 'bg-neon-500/10' : 'hover:bg-slate-800'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                                    isCompleted ? 'bg-neon-500 border-neon-500' : 'border-slate-600'
                                                }`}>
                                                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5 text-slate-900" /> : <PlayCircle className="w-3.5 h-3.5 text-slate-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <span className="text-xs text-slate-500">{lesson.duration_minutes} min</span>
                                                </div>
                                                {isCompleted && <span className="text-xs text-neon-500 font-medium">{t('common.completed')}</span>}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
      )}
    </div>
  );
};

export default TrailDetail;