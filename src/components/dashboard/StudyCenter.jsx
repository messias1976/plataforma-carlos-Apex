import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const StudyCenter = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-[600px] h-full">
      <div className="w-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 rounded-3xl border border-neon-500/20">
         <BookOpen className="w-16 h-16 text-neon-500 mb-4" />
         <h2 className="text-2xl font-bold text-white mb-2">Study Center (Mock)</h2>
         <p className="text-slate-400 max-w-md">
           This component has been simplified for the demo. In the full version, this would connect to the backend to display dynamic study materials.
         </p>
      </div>
    </div>
  );
};

export default StudyCenter;