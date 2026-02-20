import React from 'react';
import { usePlan } from '@/contexts/PlanContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProtectedFeature = ({ feature, children, fallback = null }) => {
  const { hasAccess, isPremium, planType, loading } = usePlan();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Loading state handling - render children invisibly or a spinner if critical?
  // For features, usually better to wait or show skeleton. Here we wait for context.
  if (loading) {
    return <div className="animate-pulse bg-slate-800/50 rounded-lg w-full h-32"></div>;
  }

  const isAllowed = hasAccess(feature);

  // Debug log for troubleshooting access issues
  // console.log(`ProtectedFeature [${feature}]:`, { planType, isPremium, isAllowed });

  const handleUpgrade = () => {
    navigate('/'); // Redirect to plan selection
  };

  if (isAllowed) {
    return children;
  }

  // Fallback UI for locked content
  return (
    <div className="relative group w-full h-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
      {/* Blurred content background hint */}
      <div className="absolute inset-0 blur-md opacity-20 bg-slate-800 pointer-events-none select-none p-6">
         <div className="space-y-4">
             <div className="h-8 bg-slate-600 rounded w-3/4"></div>
             <div className="h-4 bg-slate-600 rounded w-full"></div>
             <div className="h-4 bg-slate-600 rounded w-5/6"></div>
         </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center min-h-[200px]">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
            <Lock className="w-8 h-8 text-slate-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{t('common.upgradeTitle')}</h3>
        <p className="text-slate-400 text-sm max-w-xs mb-6">
           {isPremium 
             ? "Este recurso não está disponível no seu plano atual." 
             : t('common.upgradeDesc')
           }
        </p>
        
        <Button 
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold shadow-lg border-0"
        >
            <Crown className="w-4 h-4 mr-2" />
            {t('common.upgrade')}
        </Button>
      </div>
    </div>
  );
};

export default ProtectedFeature;