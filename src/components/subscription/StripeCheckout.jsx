import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/MockAuthContext';
import { useStripePayment } from '@/hooks/useStripePayment';
import { useTranslation } from '@/hooks/useTranslation';

const StripeCheckout = ({ planType, buttonText, variant = "default", className }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Links de checkout do Stripe (configuráveis via variáveis de ambiente)
  const stripeLinks = {
    standard: import.meta.env.VITE_STRIPE_STANDARD_LINK || 'https://buy.stripe.com/bJe6oI6ZDaHw5pl2wAao801',
    premium: import.meta.env.VITE_STRIPE_PREMIUM_LINK || 'https://buy.stripe.com/8x2cN65Vz6rg5pl6MQao803'
  };

  const { activateSubscription, loading: activating, error: activateError } = useStripePayment();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Por favor faça login primeiro", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      console.log("Iniciando checkout para plano:", planType);

      // Plano free: mostrar/usar formulário para coletar dados e ativar acesso
      if (planType === 'free') {
        // Validações simples
        if (!name || !phone || !birthdate) {
          toast({ title: 'Preencha todos os campos', variant: 'destructive' });
          setLoading(false);
          return;
        }

        // Salvar dados no profile (user_profiles) e ativar plano free
        try {
          await api.user.updateProfile({ full_name: name, phone: phone, birthdate: birthdate });
        } catch (upsertError) {
          console.error('Erro salvando perfil free:', upsertError);
          toast({ title: 'Erro ao salvar dados', description: upsertError.message, variant: 'destructive' });
          setLoading(false);
          return;
        }

        // Ativa assinatura free no banco (reusa hook)
        await activateSubscription('free');

        if (activateError) {
          toast({ title: 'Erro ao ativar plano', description: activateError, variant: 'destructive' });
        } else {
          toast({ title: 'Acesso liberado', description: 'Plano Free ativado com sucesso.', variant: 'default' });
        }

        setLoading(false);
        return;
      }

      // Redirecionar para o Stripe checkout para os outros planos
      const stripeUrl = stripeLinks[planType];
      if (stripeUrl) {
        window.location.href = stripeUrl + (stripeUrl.includes('?') ? '&' : '?') + `plan=${planType}`;
      } else {
        toast({
          title: "Erro",
          description: 'Link de pagamento inválido.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar checkout: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Se for plano free, renderiza formulário embutido em vez do redirecionamento
  if (planType === 'free') {
    return (
      <div className={className}>
        <div className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('forms.name') || 'Nome completo'} className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('forms.phone') || 'Telefone'} className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white" />
          <input value={birthdate} onChange={(e) => setBirthdate(e.target.value)} type="date" placeholder={t('forms.birthdate') || 'Data de nascimento'} className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white" />
        </div>
        <div className="mt-3">
          <Button onClick={handleCheckout} disabled={loading || activating} variant={variant} className="w-full">
            {loading || activating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
            {buttonText || t('landing.free.cta') || 'Obter Acesso Gratuito'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      className={className}
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
      {buttonText || (planType === 'premium' ? t('landing.premium.cta') : t('landing.standard.cta'))}
    </Button>
  );
};

export default StripeCheckout;