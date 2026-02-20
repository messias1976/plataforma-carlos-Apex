import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Bot, HelpCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const TrailsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const trails = [
    {
      id: 'tutorial',
      title: t('trails.tutorial'),
      description: t('trails.tutorialDesc'),
      icon: HelpCircle,
      link: '/tutorial',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'exams',
      title: t('trails.exams'),
      description: t('trails.examsDesc'),
      icon: BookOpen,
      link: '/theoretical-exams',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'ai',
      title: t('trails.ai'),
      description: t('trails.aiDesc'),
      icon: Bot,
      link: null, // Opens modal
      action: 'openAI',
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  const handleAction = (trail) => {
    if (trail.action === 'openAI') {
      // Trigger AI via event or context - simpler to dispatch event for global listener
      window.dispatchEvent(new CustomEvent('open-ai-teacher'));
    } else {
      navigate(trail.link);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.03 }}
        >
          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 h-full flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl transition-all">
            <div className={`h-2 w-full bg-gradient-to-r ${trail.color}`} />
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trail.color} flex items-center justify-center mb-4 shadow-lg`}>
                <trail.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white group-hover:text-neon-400 transition-colors">{trail.title}</CardTitle>
              <CardDescription className="text-slate-400">{trail.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                onClick={() => handleAction(trail)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                {t('common.open')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TrailsList;