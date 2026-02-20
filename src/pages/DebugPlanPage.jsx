import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { usePlan } from '@/contexts/PlanContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const DebugPlanPage = () => {
  const { user } = useAuth();
  const { subscription, planType, isPremium, isActive, refreshSubscription, hasAccess } = usePlan();

  useEffect(() => {
    refreshSubscription();
  }, []);

  const features = ['theoretical', 'studyZone', 'ranking', '1x1', 'ai', 'analytics'];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <Helmet>
        <title>Debug Plan Access</title>
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-neon-500" />
                Debug de Assinatura
            </h1>
            <Button onClick={refreshSubscription} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Dados
            </Button>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
                <CardTitle className="text-lg">Dados do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-sm border-b border-slate-800 pb-2">
                    <span className="text-slate-400">User ID:</span>
                    <span className="col-span-2 font-mono text-xs truncate">{user?.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="col-span-2">{user?.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-slate-400">Role:</span>
                    <span className="col-span-2">{user?.app_metadata?.role}</span>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Estado do Contexto (PlanContext)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <p className="text-slate-500 text-xs uppercase mb-1">Plan Type</p>
                        <p className="text-xl font-bold text-neon-400">{planType}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <p className="text-slate-500 text-xs uppercase mb-1">Status</p>
                        <Badge variant={isActive ? "success" : "destructive"} className={isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                            {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                    </div>
                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <p className="text-slate-500 text-xs uppercase mb-1">Is Premium?</p>
                        <p className={`text-lg font-bold ${isPremium ? 'text-green-400' : 'text-slate-400'}`}>
                            {isPremium ? 'YES' : 'NO'}
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-semibold mb-2 text-slate-300">Raw Subscription Data (DB):</p>
                    <pre className="bg-black/50 p-4 rounded text-xs text-green-400 overflow-auto max-h-40">
                        {JSON.stringify(subscription, null, 2)}
                    </pre>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
                <CardTitle className="text-lg">Verificação de Acesso (Feature Flag)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {features.map(feat => {
                        const allowed = hasAccess(feat);
                        return (
                            <div key={feat} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-sm text-slate-300">{feat}</span>
                                <Badge className={allowed ? "bg-green-600" : "bg-slate-700"}>
                                    {allowed ? "ALLOWED" : "LOCKED"}
                                </Badge>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugPlanPage;