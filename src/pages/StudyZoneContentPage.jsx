import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import ProtectedPlanRoute from '@/components/subscription/ProtectedPlanRoute';

const StudyZoneContentPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const modules = [
    {
      id: 1,
      title: '📘 MÓDULO 1 — FOCO (o maior problema do aluno)',
      copy: 'Se você sente que estuda, estuda… e não aprende nada, o problema não é burrice. É falta de foco. Seu cérebro não foi feito pra alternar entre celular, estudo e ansiedade ao mesmo tempo. Aqui você vai aprender como criar blocos curtos de foco, estudar sem distração e parar de se sentir atrasado.',
      exercise: '👉 "Agora pausa o vídeo por 10 segundos e pensa: o que mais tira seu foco quando você tenta estudar?" ⏱️ contagem silenciosa de 10 segundos'
    },
    {
      id: 2,
      title: '📘 MÓDULO 2 — TEMPO (por que parece que nunca sobra)',
      copy: 'Você não falta tempo. Você falta clareza. Quando o aluno não sabe exatamente o que estudar, ele procrastina. Aqui você vai aprender a organizar o estudo em tarefas pequenas, possíveis e sem sofrimento.',
      exercise: '👉 "Pausa por 10 segundos e responde mentalmente: qual matéria você sempre empurra pra depois?" ⏱️ 10 segundos'
    },
    {
      id: 3,
      title: '📘 MÓDULO 3 — ATENÇÃO (como estudar mesmo sendo distraído)',
      copy: 'Nem todo aluno consegue ficar horas estudando. E tá tudo bem. Produtividade não é estudar muito. É estudar do jeito certo pro SEU cérebro. Aqui você vai aprender técnicas pra manter atenção mesmo tendo dificuldade.',
      exercise: '👉 "Pausa 10 segundos e pensa: você aprende mais ouvindo, vendo ou escrevendo?" ⏱️ 10 segundos'
    },
    {
      id: 4,
      title: '📘 MÓDULO 4 — MEMÓRIA (por que você esquece tudo)',
      copy: 'Esquecer não é falha. É o cérebro economizando energia. O problema é que ninguém te ensinou como fazer o cérebro entender que aquilo é importante. Aqui você aprende como estudar pra lembrar, não só pra passar.',
      exercise: '👉 "Pausa 10 segundos e lembra: qual matéria você esquece mais rápido depois da prova?" ⏱️ 10 segundos'
    },
    {
      id: 5,
      title: '📘 MÓDULO 5 — PROVA (como não travar na hora H)',
      copy: 'Tem aluno que sabe a matéria… mas na prova dá branco. Isso não é falta de estudo, é falta de treino mental. Aqui você aprende como ler questões com calma, achar pegadinhas e controlar a ansiedade.',
      exercise: '👉 "Pausa 10 segundos e lembra da última prova: você errou por não saber ou por nervosismo?" ⏱️ 10 segundos'
    },
    {
      id: 6,
      title: '📘 MÓDULO 6 — CONSTÂNCIA (como não desistir)',
      copy: 'O problema não é começar. É continuar. Motivação acaba rápido. Disciplina é o que faz passar. Aqui você aprende como estudar mesmo sem vontade.',
      exercise: '👉 "Pausa 10 segundos e pensa: o que sempre faz você desistir de estudar?" ⏱️ 10 segundos'
    },
    {
      id: 7,
      title: '📘 MÓDULO 7 — MENTALIDADE (parar de se sentir incapaz)',
      copy: 'Se você se acha burro, atrasado ou incapaz… isso não nasceu com você. Foi aprendido. E tudo que foi aprendido pode ser mudado. Aqui você vai reconstruir sua confiança como aluno.',
      exercise: '👉 "Pausa 10 segundos e responde pra você mesmo: quem te fez acreditar que você não era capaz?" ⏱️ 10 segundos'
    }
  ];

  return (
    <ProtectedPlanRoute feature="studyZone">
      <div className="min-h-screen bg-slate-950 p-6 pb-20">
        <Helmet>
          <title>Módulos - Study Zone</title>
          return (
          <ProtectedPlanRoute feature="studyZone">
            <div className="min-h-screen bg-slate-950 p-6 md:p-12">
              <Helmet>
                <title>Zona de Estudos - APEX</title>
              </Helmet>

              <Button variant="ghost" className="mb-8 text-white" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>

              <h1 className="text-3xl font-bold text-white mb-8">Zona de Estudos</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod) => (
                  <Card key={mod.id} className="bg-slate-900 border-slate-800 hover:border-neon-500 transition-all group cursor-pointer h-full flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="text-white group-hover:text-neon-400 transition-colors">{mod.title}</CardTitle>
                      <CardDescription className="text-slate-400 mt-2">{mod.copy}</CardDescription>
                    </CardHeader>
                    <div className="p-4 text-slate-300 text-sm border-t border-slate-800">
                      {mod.exercise}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ProtectedPlanRoute>
          );
            ))}
      </div>
    </div>
      </div >
    </ProtectedPlanRoute >
  );
};

export default StudyZoneContentPage;