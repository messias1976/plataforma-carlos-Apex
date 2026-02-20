import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import { useStripePayment } from '@/hooks/useStripePayment';

const StripePaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activateSubscription, loading, error, success } = useStripePayment();

  useEffect(() => {
    // Determine plan from URL or default to standard if missing/invalid
    // Valid plans: free, standard, premium
    let planToActivate = 'standard'; 
    if (planParam && ['free', 'standard', 'premium'].includes(planParam.toLowerCase())) {
        planToActivate = planParam.toLowerCase();
    }

    if (user && !loading && !success && !error) {
        activateSubscription(planToActivate);
    }
  }, [user, planParam]); // Run once when user is available

  // If user is not logged in, we can't save the subscription to their ID.
  if (!user) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                    <CardTitle className="text-yellow-500">Autenticação Necessária</CardTitle>
                    <CardDescription>Faça login para ativar sua assinatura.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={() => navigate('/login', { state: { from: `/payment-success?plan=${planParam}` } })} className="w-full">
                        Ir para Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-slate-900/80 backdrop-blur-xl border-green-500/30 shadow-2xl shadow-green-500/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                {loading ? (
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                ) : error ? (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                ) : (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                )}
            </div>
            <CardTitle className="text-2xl text-white">
                {loading ? "Processando..." : error ? "Erro ao Ativar" : "Pagamento realizado com sucesso!"}
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg">
                {!loading && !error && "Seu plano foi ativado com sucesso."}
                {error && "Houve um problema ao salvar sua assinatura."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-8 text-center space-y-4">
            {loading ? (
                <p className="text-slate-400">Estamos confirmando seu pagamento e liberando seu acesso...</p>
            ) : error ? (
                 <p className="text-red-400">{error}</p>
            ) : (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-white uppercase">
                            PLANO {planParam || 'Standard'}
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 text-left pl-8">
                        Sua conta foi atualizada. Você agora tem acesso total aos recursos do seu plano.
                    </p>
                </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
             <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-lg shadow-green-900/20"
                disabled={loading}
             >
                {loading ? "Aguarde..." : "Acessar Dashboard"} <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default StripePaymentSuccess;