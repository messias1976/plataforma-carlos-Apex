import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const StripePaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px]" />
        </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-slate-900/80 backdrop-blur-xl border-red-500/30 shadow-2xl shadow-red-500/10">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-white">
                Pagamento cancelado
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg">
                O processo de pagamento não foi concluído.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-8 text-center">
             <p className="text-slate-300">
                Nenhuma cobrança foi efetuada. Você pode tentar novamente a qualquer momento para desbloquear os recursos premium.
             </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
             <Button 
                onClick={() => navigate('/')} 
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-12"
             >
                <RefreshCw className="mr-2 w-4 h-4" />
                Tentar Novamente
             </Button>
             <Button 
                variant="ghost"
                onClick={() => navigate('/')} 
                className="w-full text-slate-400 hover:text-white"
             >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar para Planos
             </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default StripePaymentCancel;