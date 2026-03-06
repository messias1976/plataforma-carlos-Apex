import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ProtectedPlanRoute from '@/components/subscription/ProtectedPlanRoute';
import api from '@/lib/api';

const STUDY_MODULES = [
  { id: '1', name: 'Módulo 1 - Foco', description: 'O maior problema do aluno.' },
  { id: '2', name: 'Módulo 2 - Tempo', description: 'Por que parece que nunca sobra tempo.' },
  { id: '3', name: 'Módulo 3 - Atenção', description: 'Como estudar mesmo sendo distraído.' },
  { id: '4', name: 'Módulo 4 - Memória', description: 'Por que você esquece o que estudou.' },
  { id: '5', name: 'Módulo 5 - Prova', description: 'Como não travar na hora H.' },
  { id: '6', name: 'Módulo 6 - Constância', description: 'Como manter o ritmo sem desistir.' },
  { id: '7', name: 'Módulo 7 - Mentalidade', description: 'Como parar de se sentir incapaz.' },
];

const StudyZoneContentPage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState(STUDY_MODULES);
  const [loading, setLoading] = useState(true);

  const extractList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    return [];
  };

  const parseDataField = (dataField) => {
    if (!dataField) return {};
    if (typeof dataField === 'object') return dataField;
    if (typeof dataField === 'string') {
      try {
        const parsed = JSON.parse(dataField);
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch {
        return {};
      }
    }

    return {};
  };

  const normalizeModuleId = (rawValue) => {
    if (rawValue == null) return null;
    const numericCandidate = String(rawValue).match(/\d+/)?.[0];
    if (!numericCandidate) return null;

    const parsed = Number(numericCandidate);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 7) return null;
    return String(parsed);
  };

  const resolveContentTopicKey = (item) => {
    const parsedData = parseDataField(item?.data);
    const directValues = [
      item?.topic_id,
      item?.module_id,
      parsedData?.topic_id,
      parsedData?.module_id,
      item?.topic?.id,
    ];

    for (const value of directValues) {
      const normalized = normalizeModuleId(value);
      if (normalized) return normalized;
    }

    return null;
  };

  const normalizeContentType = (item) => {
    const parsedData = parseDataField(item?.data);
    const rawType = String(
      item?.content_type ||
      parsedData?.content_type ||
      item?.type ||
      parsedData?.type ||
      'text'
    ).toLowerCase();

    if (rawType === 'document' || rawType === 'doc' || rawType === 'file' || rawType === 'arquivo' || rawType === 'pdf') {
      return 'document';
    }

    if (rawType === 'audio' || rawType === 'mp3' || rawType === 'wav') {
      return 'audio';
    }

    if (rawType === 'video' || rawType === 'youtube' || rawType === 'vimeo') {
      return 'video';
    }

    return 'text';
  };

  const formatModuleTypes = (types) => {
    const labels = {
      text: 'Texto',
      video: 'Vídeo',
      audio: 'Áudio',
      document: 'Arquivo',
    };

    return types.map((type) => labels[type] || 'Texto').join(' | ');
  };

  useEffect(() => {
    const loadModules = async () => {
      setLoading(true);
      try {
        const contentResponse = await api.topicContent.getAll();
        const contentList = extractList(contentResponse);

        const moduleStats = new Map(
          STUDY_MODULES.map((module) => [module.id, { total: 0, types: new Set() }])
        );

        contentList.forEach((item) => {
          const moduleId = resolveContentTopicKey(item);
          if (!moduleId || !moduleStats.has(moduleId)) return;

          const moduleData = moduleStats.get(moduleId);
          moduleData.total += 1;
          moduleData.types.add(normalizeContentType(item));
        });

        setModules(
          STUDY_MODULES.map((module) => {
            const stat = moduleStats.get(module.id);
            const total = stat?.total || 0;
            const types = Array.from(stat?.types || []);

            return {
              ...module,
              totalItems: total,
              types,
            };
          })
        );
      } catch (error) {
        console.error('Falha ao carregar conteúdos da study-zone:', error);
        setModules(STUDY_MODULES);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="bg-slate-900 border-slate-800 hover:border-neon-500 transition-all group cursor-pointer h-full"
                onClick={() => navigate(`/topic/${module.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-neon-400" />
                    <CardTitle className="text-white group-hover:text-neon-400 transition-colors">
                      {module.name || `Módulo ${module.id}`}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 mt-2">
                    {module.description || 'Sem descrição disponível.'}
                  </CardDescription>
                  <CardDescription className="text-slate-500 mt-3">
                    {(module.totalItems || 0) > 0
                      ? `${module.totalItems} material(is) - ${formatModuleTypes(module.types || ['text'])}`
                      : 'Sem materiais cadastrados ainda.'}
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
