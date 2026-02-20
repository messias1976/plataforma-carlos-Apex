import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Globe, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/MockAuthContext';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandingPage = () => {
    const { t, changeLanguage, language } = useLanguage();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSelectPlan = (planId) => {
        // Se não estiver autenticado, redireciona para login
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Se autenticado:
        if (planId === 'free') {
            // Redireciona para dashboard, onde o usuário pode ativar o plano free
            navigate('/dashboard');
        } else if (planId === 'standard') {
            window.location.href = 'https://buy.stripe.com/bJe6oI6ZDaHw5pl2wAao801';
        } else if (planId === 'premium') {
            window.location.href = 'https://buy.stripe.com/8x2cN65Vz6rg5pl6MQao803';
        }
    };

    const plans = [
        {
            id: 'free',
            name: "Plano Gratuito",
            price: "Grátis",
            features: [
                "Acesso limitado à Zona de Estudo",
                "10 perguntas diárias",
                "Perfil de Estudante Básico"
            ],
            cta: "Começar Agora",
            color: 'from-slate-700 to-slate-800',
            buttonVariant: 'outline',
            badge: null
        },
        {
            id: 'standard',
            name: "Plano Padrão",
            price: "35,66/mês",
            features: [
                "Acesso a todas as matérias",
                "Exames Teóricos Ilimitados",
                "Certificados de Conclusão",
                "Sem anúncios"
            ],
            cta: "Escolher Plano",
            color: 'from-blue-600 to-indigo-700',
            buttonVariant: 'default',
            badge: 'Popular'
        },
        {
            id: 'premium',
            name: "Plano Premium",
            price: "65,90/mês",
            features: [
                "Tudo do Padrão",
                "Mentor IA 24/7",
                "Escape Room Educativo",
                "Análise de Desempenho Avançada",
                "Prioridade no Suporte"
            ],
            cta: "Escolher Plano",
            color: 'from-orange-500 to-red-600',
            buttonVariant: 'default',
            badge: 'Best Value'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col overflow-x-hidden">
            <Helmet>
                <title>APEX - Plataforma de Aprendizado</title>
                <meta name="description" content="Aprenda qualquer assunto com IA." />
            </Helmet>

            {/* Header */}
            <header className="w-full border-b border-white/5 bg-slate-950 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-blue-500"></div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            APEX
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeLanguage(language === 'en' ? 'pt' : 'en')}
                            className="text-slate-400 hover:text-white"
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'PT' : 'EN'}
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="bg-green-600 hover:bg-green-700 text-white hidden sm:flex"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Login'}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Hero Section */}
                <section className="relative py-24 px-4 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 opacity-50" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
                        >
                            Domine o Conhecimento
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            O APEX é uma plataforma de aprendizado adaptativo que utiliza Inteligência Artificial para personalizar seus estudos.
                            Acesse professores virtuais, provas dinâmicas e dispute conhecimento com outros alunos.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="pt-4"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                                className="h-14 px-12 text-lg bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg shadow-green-900/20 transition-all hover:scale-105"
                            >
                                {isAuthenticated ? 'Acessar Plataforma' : 'Começar Agora'}
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-20 px-4 bg-slate-950 relative border-t border-slate-900">
                    <div className="container mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('landing.title')}</h2>
                            <p className="text-slate-400">{t('landing.subtitle')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {plans.map((plan, index) => {
                                const features = Array.isArray(plan.features) ? plan.features : [];
                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                    >
                                        <Card className="w-full h-full bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-600 transition-colors flex flex-col relative overflow-hidden group">
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />

                                            {plan.badge && (
                                                <div className="absolute top-4 right-4">
                                                    <Badge className={`bg-gradient-to-r ${plan.color} text-white font-bold border-none`}>
                                                        {plan.badge}
                                                    </Badge>
                                                </div>
                                            )}

                                            <CardHeader className="text-center pb-2 pt-8">
                                                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                                                <CardDescription className="text-slate-400 mt-2 text-lg font-medium">
                                                    {plan.price}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-1 flex flex-col items-center py-6">
                                                <div className="w-full space-y-4">
                                                    {features.map((feature, i) => (
                                                        <div key={i} className="flex items-center text-sm text-slate-300">
                                                            <div className={`mr-3 p-1 rounded-full bg-gradient-to-br ${plan.color} bg-opacity-20 shrink-0`}>
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>

                                            <CardFooter className="pt-4 pb-8">
                                                <Button
                                                    className={`w-full h-12 text-md font-bold ${plan.id === 'free' ? 'bg-slate-800 hover:bg-slate-700' : `bg-gradient-to-r ${plan.color} hover:opacity-90`} text-white border-0 shadow-lg`}
                                                    onClick={() => handleSelectPlan(plan.id)}
                                                >
                                                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 border-t border-slate-900 bg-slate-950">
                <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
                    © 2026 APEX Education.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;