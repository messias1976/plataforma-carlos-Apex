
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Globe, ArrowRight, Lock, Crown, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/MockAuthContext';

const PlanSelectionPage = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const { user } = useAuth();

  const handleSelectPlan = (planId) => {
    if (planId === 'standard') {
       window.location.href = 'https://buy.stripe.com/test_bJe6oI6ZDaHw5pl2wAao801';
    } else if (planId === 'premium') {
       // Premium is marked as "Current Plan" in this mock scenario for visual fidelity, 
       // or leads to a specific link if needed.
       window.location.href = 'https://buy.stripe.com/test_fZu8wQes52b0aJF5IMao802';
    }
  };

  const handleAdminClick = () => {
    navigate('/login');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  }

  const plans = [
    {
      id: 'free',
      name: "Free Trial",
      price: "R$ 0,00",
      description: "Acesso completo por 48 horas",
      features: [
        'Provas Teóricas',
        'Zona de Estudos',
        'Agente AI (Limitado)',
        '1x1 Tournament',
        'Ranking Global'
      ],
      cta: "Indisponível",
      disabled: true,
      color: 'from-slate-700 to-slate-800',
      icon: Zap
    },
    {
      id: 'standard',
      name: "Standard",
      price: "R$ 35,66/mês",
      description: "Para estudantes focados",
      features: [
        'Provas Teóricas',
        'Zona de Estudos',
        'Agente AI (Ilimitado)',
        '1x1 Tournament',
        'Ranking Global'
      ],
      cta: "Assinar Standard",
      disabled: false,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Popular',
      icon: Star
    },
    {
      id: 'premium',
      name: "Premium",
      price: "R$ 65,90/mês",
      description: "A experiência completa",
      features: [
        'Provas Teóricas',
        'Zona de Estudos',
        'Agente AI (Personalidades)',
        '1x1 Tournament',
        'Ranking Global',
        'Feedback Detalhado'
      ],
      cta: "Plano Atual",
      disabled: false, // In a real app, might be disabled if already subscribed
      color: 'from-orange-500 to-red-600',
      badge: 'Best Value',
      icon: Crown
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1624388611710-bdf95023d1c2")',
          opacity: 0.15 
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />

      {/* Header */}
      <div className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-500 to-blue-500"></div>
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
          
          {user ? (
             <Button
                variant="default"
                size="sm"
                onClick={handleDashboardClick}
                className="bg-neon-600 hover:bg-neon-700 text-white"
             >
                Dashboard
             </Button>
          ) : (
             <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminClick}
                className="text-slate-500 hover:text-white"
            >
                <Lock className="w-4 h-4 mr-2" />
                Login
            </Button>
          )}
        </div>
      </div>

      {/* Hero Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center flex-1">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mb-12"
        >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                Escolha seu Nível
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
                Desbloqueie todo o potencial da sua mente com nossos planos adaptativos.
            </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl pb-20">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="flex"
                >
                    <Card className={`w-full bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-600 transition-colors flex flex-col relative overflow-hidden group`}>
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />
                        
                        {plan.badge && (
                            <div className="absolute top-4 right-4">
                                <Badge className={`bg-gradient-to-r ${plan.color} text-white font-bold border-none`}>
                                    {plan.badge}
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="text-center pb-2 pt-8">
                            <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} bg-opacity-10 flex items-center justify-center mb-4 shadow-lg shadow-black/50`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <CardDescription className="text-slate-300 mt-2 font-medium">
                                {plan.description}
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col items-center py-6 px-8">
                             <div className="text-3xl font-bold text-white mb-8">
                                {plan.price}
                             </div>
                             <div className="w-full space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center text-sm text-slate-300">
                                        <div className={`mr-3 p-1 rounded-full bg-gradient-to-br ${plan.color} bg-opacity-20 shrink-0`}>
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                             </div>
                        </CardContent>
                        
                        <CardFooter className="pt-4 pb-8 px-8">
                            <Button 
                                className={`w-full h-12 text-md font-bold ${
                                    plan.disabled 
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                                        : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white border-0 shadow-lg shadow-purple-900/20`
                                }`}
                                onClick={() => !plan.disabled && handleSelectPlan(plan.id)}
                                disabled={plan.disabled}
                            >
                                {plan.cta} {!plan.disabled && <ArrowRight className="ml-2 w-4 h-4" />}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
              );
            })}
        </div>
      </main>
      
      <footer className="relative z-10 w-full py-6 text-center text-slate-600 text-sm">
        <p>© 2026 APEX Education. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default PlanSelectionPage;
