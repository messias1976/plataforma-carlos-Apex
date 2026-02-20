import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Crown, Zap, Shield } from 'lucide-react';
import StripeCheckout from './StripeCheckout';
import { useSubscription } from '@/hooks/useSubscription';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0,00',
    description: 'Acesso gratuito com recursos limitados',
    features: ['Provas Teóricas', 'Zona de Estudos', 'Agente AI (Limitado)'],
    unsupported: ['1x1 Tournament', 'Ranking Global'],
    icon: Shield,
    color: 'text-slate-400'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 'R$ 35,66',
    period: '/mês',
    description: 'Para estudantes focados',
    features: ['Provas Teóricas', 'Zona de Estudos', 'Agente AI (Ilimitado)'],
    unsupported: ['1x1 Tournament', 'Ranking Global'],
    icon: Zap,
    color: 'text-blue-400'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 65,90',
    period: '/mês',
    description: 'A experiência completa',
    features: ['Provas Teóricas', 'Zona de Estudos', 'Agente AI (Personalidades)', '1x1 Tournament', 'Ranking Global', 'Feedback Detalhado'],
    unsupported: [],
    icon: Crown,
    color: 'text-yellow-400',
    popular: true
  }
];

const SubscriptionManager = () => {
  const { subscription, loading } = useSubscription();

  if (loading) return <div>Loading plans...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto p-4">
      {plans.map((plan) => {
        const isCurrent = subscription?.plan_type === plan.id || (plan.id === 'free_trial' && subscription?.plan_type === 'expired' && false);
        const features = Array.isArray(plan.features) ? plan.features : [];
        const unsupported = Array.isArray(plan.unsupported) ? plan.unsupported : [];

        return (
          <Card
            key={plan.id}
            className={`relative flex flex-col bg-slate-900 border-2 ${isCurrent ? 'border-neon-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-slate-800'} ${plan.popular ? 'md:scale-105 z-10' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-1">
                  MAIS POPULAR
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-2">
              <div className={`mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 ${plan.color}`}>
                <plan.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
              <CardDescription className="text-slate-400">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col items-center">
              <div className="text-3xl font-bold text-white mb-6">
                {plan.price}
                <span className="text-sm font-normal text-slate-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 w-full">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-slate-300">
                    <Check className="w-4 h-4 mr-2 text-neon-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {unsupported.map((feature, idx) => (
                  <li key={`u-${idx}`} className="flex items-center text-sm text-slate-600">
                    <X className="w-4 h-4 mr-2 text-slate-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-4">
              {isCurrent ? (
                <Button className="w-full bg-slate-800 text-slate-400 cursor-default hover:bg-slate-800" variant="secondary">
                  Plano Atual
                </Button>
              ) : plan.id !== 'free_trial' ? (
                <StripeCheckout planType={plan.id} buttonText={`Assinar ${plan.name}`} />
              ) : (
                <Button className="w-full" variant="outline" disabled>Indisponível</Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionManager;