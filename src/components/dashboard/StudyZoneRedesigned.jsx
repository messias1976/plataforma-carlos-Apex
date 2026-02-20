import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import ProtectedFeature from '@/components/subscription/ProtectedFeature';
import { useNavigate } from 'react-router-dom';

const StudyZoneRedesigned = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleModulesClick = () => {
    navigate('/study-zone');
  };

  return (
    <ProtectedFeature feature="studyZone">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
        {/* Left Panel - Modules */}
        <div className="flex-1 space-y-4">
          <Card
            className="overflow-hidden cursor-pointer transition-all duration-300 border bg-slate-900 border-slate-800 hover:border-neon-500/50"
            onClick={handleModulesClick}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center text-neon-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Módulos de Estudo</h3>
                    <p className="text-slate-400 text-sm">Aprenda técnicas comprovadas para estudar melhor</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-80 space-y-4">
          <Card className="bg-slate-900 border-slate-800 p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-neon-500 mb-4 p-1">
              <img src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="rounded-full bg-slate-950 w-full h-full" />
            </div>
            <h3 className="text-xl font-bold text-white">{user?.full_name || t('dashboard.header.student')}</h3>
            <p className="text-slate-400 text-sm mb-6">{user?.email}</p>

            <div className="text-left space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-2">{t('studyZone.progress')}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">Geral</span>
                    <span className="text-neon-400">12%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full">
                    <div className="h-full bg-neon-500 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedFeature>
  );
};

export default StudyZoneRedesigned;