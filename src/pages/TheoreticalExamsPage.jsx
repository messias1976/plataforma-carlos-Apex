import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Play, FileText, ExternalLink } from 'lucide-react';
import ExamPlayer from '@/components/dashboard/ExamPlayer';
import { Badge } from '@/components/ui/badge';
import ProtectedFeature from '@/components/subscription/ProtectedFeature';
import { useTranslation } from '@/hooks/useTranslation';

const TheoreticalExamsPage = () => {
  const { t } = useTranslation();
  const [activeExam, setActiveExam] = useState(null);


  const exams = [
    { id: 1, title: 'Simulado ENEM 2024 - Dia 1', questions: 90, time: '5h 30m', subject: 'Humanas & Linguagens', theme: 'ENEM', grade: 'Ensino Médio', difficulty: 'difícil' },
    { id: 2, title: 'Simulado ENEM 2024 - Dia 2', questions: 90, time: '5h 00m', subject: 'Natureza & Matemática', theme: 'ENEM', grade: 'Ensino Médio', difficulty: 'difícil' },
    { id: 3, title: 'Revisão Geral - Física', questions: 45, time: '2h 00m', subject: 'Ciências da Natureza', theme: 'Física', grade: 'Ensino Médio', difficulty: 'média' },
  ];

  const selectedExam = exams.find(e => e.id === activeExam);
  if (activeExam && selectedExam) {
    return (
      <ExamPlayer
        examId={selectedExam.id}
        subject={selectedExam.subject}
        theme={selectedExam.theme}
        grade={selectedExam.grade}
        difficulty={selectedExam.difficulty}
        onClose={() => setActiveExam(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <Helmet>
        <title>{t('exams.title')} - APEX</title>
      </Helmet>

      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">{t('exams.title')}</h1>
        <p className="text-slate-400 max-w-2xl">
          {t('exams.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ProtectedFeature key={exam.id} feature="theoretical">
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group cursor-pointer h-full flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-neon-400 border-neon-500/30">{exam.subject}</Badge>
                </div>
                <CardTitle className="text-white group-hover:text-neon-400 transition-colors">{exam.title}</CardTitle>
                <CardDescription className="text-slate-500 flex items-center gap-4 mt-2">
                  <span className="flex items-center"><FileText className="w-4 h-4 mr-1" /> {exam.questions} {t('exams.questions')}</span>
                  <span>{exam.time}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="w-full bg-neon-600 hover:bg-neon-500 text-white" onClick={() => setActiveExam(exam.id)}>
                  <Play className="w-4 h-4 mr-2" /> {t('exams.startExam')}
                </Button>
              </CardFooter>
            </Card>
          </ProtectedFeature>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{t('exams.external')}</h3>
          <p className="text-slate-400 text-sm">Acesse provas anteriores do INEP e materiais oficiais.</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white" onClick={() => window.open('https://www.gov.br/inep/pt-br', '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" /> Portal INEP
        </Button>
      </div>
    </div>
  );
};

export default TheoreticalExamsPage;