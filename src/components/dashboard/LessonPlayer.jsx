import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrails } from '@/contexts/TrailsContext';

const LessonPlayer = ({ lesson, onComplete, onNext, onPrev, hasNext, hasPrev }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
      {/* Video / Content Area */}
      <div className="aspect-video w-full bg-black relative flex items-center justify-center group">
        {lesson.video_url ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                 {/* Placeholder for actual video player */}
                 <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-neon-500 mx-auto mb-4 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-slate-400">Video Player Simulation</p>
                 </div>
            </div>
        ) : (
            <div className="p-8 flex items-center justify-center h-full bg-slate-800 text-slate-400">
                No video available for this lesson.
            </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">{lesson.title}</h2>
        <div className="prose prose-invert max-w-none text-slate-300">
            <p>{lesson.content}</p>
            <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <h4 className="font-bold text-neon-400 mb-2">{t('lesson.resources')}</h4>
                <ul className="list-disc list-inside text-sm text-slate-400">
                    <li>Additional reading material PDF</li>
                    <li>Source code examples</li>
                </ul>
            </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center gap-4">
        <Button 
            variant="ghost" 
            disabled={!hasPrev} 
            onClick={onPrev}
            className="text-slate-400 hover:text-white"
        >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('lesson.previous')}
        </Button>

        <Button 
            onClick={() => onComplete(lesson.id)}
            className="bg-neon-600 hover:bg-neon-500 text-white px-8"
        >
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('lesson.complete')}
        </Button>

        <Button 
            variant="ghost"
            disabled={!hasNext}
            onClick={onNext}
            className="text-slate-400 hover:text-white"
        >
            {t('lesson.next')}
            <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default LessonPlayer;