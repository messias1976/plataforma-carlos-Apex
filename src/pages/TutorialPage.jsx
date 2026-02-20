
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, Crown, Layers, Map, GraduationCap, Bot, Smartphone, Swords, Trophy, BarChart, ShoppingBag } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/constants/animations';

const TutorialPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <Helmet>
        <title>{t('tutorial.title')} - Apex</title>
      </Helmet>

      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center justify-center p-3 bg-neon-500/10 rounded-xl mb-4">
                    <BookOpen className="w-8 h-8 text-neon-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Manual do Estudante APEX</h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Bem-vindo à revolução do aprendizado. Aprenda como dominar a plataforma e maximizar seus resultados nos estudos.
                </p>
            </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-12">
            
            {/* Section 1: Introduction */}
            <motion.section variants={fadeIn} className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 border-l-4 border-neon-500 pl-4">
                    Visão Geral da Plataforma
                </h2>
                <div className="prose prose-invert max-w-none text-slate-300">
                    <p>
                        O <strong>APEX</strong> é uma plataforma de Ensino Adaptativo que utiliza Inteligência Artificial para personalizar sua jornada de aprendizado. Diferente de escolas tradicionais, aqui você evolui no seu ritmo, ganhando recompensas e subindo de nível conforme estuda.
                    </p>
                    <p>
                        A plataforma é dividida em módulos interativos que cobrem desde o aprendizado passivo (aulas) até o ativo (batalhas, simulados e desafios).
                    </p>
                </div>
            </motion.section>

            {/* Section 2: Features Guide */}
            <motion.section variants={fadeIn} className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 border-l-4 border-purple-500 pl-4">
                    Funcionalidades Principais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-white">
                                <GraduationCap className="w-5 h-5 text-purple-400" /> Zona de Estudo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-400">
                            Seu hub central de conteúdo. Acesse trilhas de conhecimento organizadas por disciplina, assista videoaulas, leia resumos e acompanhe seu progresso percentual em cada matéria.
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-white">
                                <Bot className="w-5 h-5 text-neon-400" /> Professor IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-400">
                            Um tutor disponível 24h. Use o "Estudo Personalizado" para selecionar matérias e tirar dúvidas, pedir explicações ou solicitar exercícios sobre qualquer tópico.
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-white">
                                <Swords className="w-5 h-5 text-red-400" /> Batalha 1v1
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-400">
                            Desafie outros estudantes em tempo real. Responda perguntas de conhecimentos gerais ou específicos. Quem responder mais rápido e corretamente ganha XP e sobe no Ranking.
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg text-white">
                                <BarChart className="w-5 h-5 text-blue-400" /> Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-400">
                            Dados detalhados sobre sua performance. Descubra seus pontos fortes e fracos, horas estudadas e desempenho comparativo. (Disponível no plano PRO).
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Section 3: Navigation FAQ */}
            <motion.section variants={fadeIn} className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 border-l-4 border-green-500 pl-4">
                    Perguntas Frequentes de Navegação
                </h2>
                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-slate-800">
                        <AccordionTrigger className="text-slate-200 hover:text-white">Como começo a estudar?</AccordionTrigger>
                        <AccordionContent className="text-slate-400">
                            Vá para a aba <strong>INÍCIO</strong> ou <strong>ZONA DE ESTUDO</strong>. Selecione um card de disciplina (ex: Matemática) ou use a área "Estudo Personalizado" para iniciar um chat com a IA sobre um tema específico.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-slate-800">
                        <AccordionTrigger className="text-slate-200 hover:text-white">Como funcionam as Moedas e XP?</AccordionTrigger>
                        <AccordionContent className="text-slate-400">
                            Você ganha XP (Experiência) ao completar aulas e acertar questões, o que aumenta seu Nível. Moedas são ganhas em desafios e Batalhas, e podem ser usadas na <strong>LOJA</strong> para comprar itens de personalização para seu avatar.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-slate-800">
                        <AccordionTrigger className="text-slate-200 hover:text-white">O que é o modo Torneio?</AccordionTrigger>
                        <AccordionContent className="text-slate-400">
                            É o modo competitivo encontrado na aba <strong>BATALHA 1v1</strong>. O sistema busca um oponente do seu nível e inicia um quiz rápido. O vencedor leva a glória e pontos extras para o Ranking semanal.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </motion.section>

        </motion.div>
      </div>

      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none"
      >
          <Button 
            onClick={() => navigate('/dashboard')}
            className="pointer-events-auto shadow-xl bg-neon-600 hover:bg-neon-500 text-white font-bold px-8 py-6 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o Dashboard
          </Button>
      </motion.div>
    </div>
  );
};

export default TutorialPage;
