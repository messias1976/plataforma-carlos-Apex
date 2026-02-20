import React, { useEffect, useState } from 'react';
import { usePlan } from '@/contexts/PlanContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const ProtectedPlanRoute = ({ children, feature }) => {
  const { hasAccess, loading, planType, isPremium } = usePlan();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!loading) {
      const allowed = hasAccess(feature);
      console.log(`ProtectedPlanRoute [${feature}] check:`, { planType, isPremium, allowed, loading });

      if (!allowed) {
        setShowUpgrade(true);
      }
    }
  }, [loading, hasAccess, feature, planType, isPremium]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-neon-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (showUpgrade) {
    return (
      <Dialog open={true} onOpenChange={() => navigate('/')}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md" aria-describedby="protected-plan-desc">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            <DialogTitle className="text-center text-xl">{t('common.upgradeTitle')}</DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              Este recurso ({feature}) requer um plano superior.
              <br />
              Seu plano atual: <span className="text-white font-semibold uppercase">{planType}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold border-0"
            >
              {t('common.upgrade')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-400">
              {t('common.backToDashboard')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return children;
};

export default ProtectedPlanRoute;