import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ProtectedPlanRoute from '@/components/subscription/ProtectedPlanRoute';
import api from '@/lib/api';

const StudyZoneContentPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      try {
        const response = await api.subjects.getAll();
        const list = Array.isArray(response?.data)
          ? response.data
          : (Array.isArray(response) ? response : []);

        setSubjects(list);
      } catch (error) {
        console.error('Erro ao carregar módulos:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  return (
    <ProtectedPlanRoute feature="studyZone">
      <div className="min-h-screen bg-slate-950 p-6 md:p-12">
        <Helmet>
          <title>Zona de Estudos - APEX</title>
        </Helmet>

        <Button variant="ghost" className="mb-8 text-white" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>

        <h1 className="text-3xl font-bold text-white mb-8">Zona de Estudos</h1>

        {loading ? (
          <div className="text-slate-400">Carregando módulos...</div>
        ) : subjects.length === 0 ? (
          <div className="text-slate-400 border border-dashed border-slate-800 rounded-lg p-6">
            Nenhum módulo cadastrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="bg-slate-900 border-slate-800 hover:border-neon-500 transition-all group cursor-pointer h-full"
                onClick={() => navigate(`/study-zone/${subject.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-neon-400" />
                    <CardTitle className="text-white group-hover:text-neon-400 transition-colors">
                      {subject.name || subject.title || `Módulo ${subject.id}`}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 mt-2">
                    {subject.description || 'Sem descrição disponível.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedPlanRoute>
  );
};

export default StudyZoneContentPage;
