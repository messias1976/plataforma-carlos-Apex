import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Star, Shield, X, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import UpgradeModal from './UpgradeModal';

const SubscriptionCards = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const currentPlan = user?.subscription?.plan || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: 'Grátis por 48h',
      priceValue: 0,
      description: 'Teste a plataforma por 2 dias',
      features: [
        'Acesso a Provas Teóricas (visualização)',
        'Perfil Básico',
        'Acesso limitado a conteúdos'
      ],
      notIncluded: [
        'Torneios 1v1',
        'Ranking Global',
        'Mentor AI personalizado',
        'Certificados'
      ],
      icon: Clock,
      color: 'slate',
      btnText: currentPlan === 'free' ? t('subscription.current') : 'Iniciar Trial',
      plan_type: 'free'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 'R$ 35,66',
      priceValue: 35.66,
      period: '/mês',
      description: 'Ideal para estudos regulares',
      features: [
        'Acesso completo a Provas Teóricas',
        'Zona de Estudos completa',
        'Mentor AI personalizado',
        'Sem Anúncios',
        'Certificados de conclusão'
      ],
      notIncluded: [
        'Torneios 1v1',
        'Ranking Global'
      ],
      icon: Zap,
      color: 'blue',
      btnText: currentPlan === 'standard' ? t('subscription.current') : 'Assinar Standard',
      plan_type: 'standard',
      stripePriceId: 'price_standard_monthly'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 65,90',
      priceValue: 65.90,
      period: '/mês',
      description: 'Acesso total e recursos exclusivos',
      features: [
        'Tudo do Standard +',
        'Torneios 1v1',
        'Ranking Global',
        'Professor IA 24/7',
        'Escape Rooms',
        'Prioridade no suporte',
        'Certificados Premium'
      ],
      notIncluded: [],
      icon: Star,
      color: 'neon',
      btnText: currentPlan === 'premium' ? t('subscription.current') : 'Assinar Premium',
      plan_type: 'premium',
      stripePriceId: 'price_premium_monthly'
    }
  ];

  const handlePlanClick = (plan) => {
    if (plan.id === currentPlan) return;
    if (plan.id === 'free') {
      return;
    }
    setSelectedPlan(plan.id);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          const isPopular = plan.id === 'premium';
          const features = Array.isArray(plan.features) ? plan.features : [];
          const notIncluded = Array.isArray(plan.notIncluded) ? plan.notIncluded : [];

          return (
            <Card
              key={plan.id}
              className={`relative bg-slate-900/60 border-2 flex flex-col ${isCurrent
                  ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                  : isPopular
                    ? 'border-neon-500/50 shadow-[0_0_20px_rgba(15,255,80,0.1)]'
                    : 'border-slate-800'
                } transition-all duration-300 hover:transform hover:-translate-y-2`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-neon-500 text-slate-950 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Plano Atual
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${plan.id === 'premium' ? 'bg-neon-500/20 text-neon-400' :
                    plan.id === 'standard' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700/20 text-slate-400'
                  }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                </div>

                <div className="space-y-4">
                  <div>
                    <ul className="space-y-3">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.id === 'premium' ? 'text-neon-500' :
                              plan.id === 'standard' ? 'text-blue-400' :
                                'text-slate-500'
                            }`} />
                          <span className="text-left">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {notIncluded.length > 0 && (
                    <div className="pt-3 border-t border-slate-700/50">
                      <ul className="space-y-2">
                        {notIncluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-500">
                            <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-600" />
                            <span className="text-left line-through">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePlanClick(plan)}
                  disabled={isCurrent}
                  className={`w-full font-bold h-11 ${isCurrent
                      ? 'bg-green-500/20 text-green-500 border border-green-500/50 cursor-default opacity-100 hover:bg-green-500/20'
                      : plan.id === 'premium'
                        ? 'bg-neon-600 hover:bg-neon-500 text-white'
                        : plan.id === 'standard'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                >
                  {plan.btnText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <UpgradeModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        planData={plans.find(p => p.id === selectedPlan)}
      />
    </>
  );
};

export default SubscriptionCards;