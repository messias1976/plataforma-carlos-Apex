import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { useStripe } from '@/contexts/StripeContext';

const UpgradeModal = ({ isOpen, onClose, plan, planData }) => {
  const { createCheckoutSession, loading } = useStripe();

  if (!plan || !planData) return null;

  const handleUpgrade = async () => {
    await createCheckoutSession(plan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-neon-500/20 text-white max-w-md" aria-describedby="upgrade-modal-desc">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neon-500" />
            Fazer Upgrade para {planData.name}
          </DialogTitle>
          <DialogDescription id="upgrade-modal-desc" className="text-slate-400">
            Desbloqueie todos os recursos e acelere seu aprendizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="text-center mb-4">
              <span className="text-4xl font-extrabold text-white">{planData.price}</span>
              {planData.period && <span className="text-slate-400">{planData.period}</span>}
            </div>

            <ul className="space-y-3">
              {planData.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 mt-0.5 text-neon-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-neon-600 hover:bg-neon-500 text-white font-bold h-12 text-lg shadow-lg shadow-neon-500/30"
          >
            {loading ? 'Processando...' : `Assinar ${planData.name}`}
          </Button>

          <p className="text-xs text-center text-slate-500">
            Pagamento seguro via Stripe. Cancele a qualquer momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;