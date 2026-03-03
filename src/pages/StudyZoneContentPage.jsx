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
  const [sourceType, setSourceType] = useState('subjects');
  const [loading, setLoading] = useState(true);

  const extractList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    return [];
  };

  const resolveContentTopicKey = (item) => {
    const directKey = item?.topic_id || item?.module_id;
    if (directKey) return String(directKey);

    if (typeof item?.data === 'string') {
      try {
        const parsed = JSON.parse(item.data);
        const parsedKey = parsed?.topic_id || parsed?.module_id;
        if (parsedKey) return String(parsedKey);
      } catch {
        return null;
      }
    }

    if (item?.data && typeof item.data === 'object') {
      const dataKey = item.data?.topic_id || item.data?.module_id;
      if (dataKey) return String(dataKey);
    }

    return null;
  };

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      try {
        let loaded = false;

        try {
          const subjectsResponse = await api.subjects.getAll();
          const subjectsList = extractList(subjectsResponse);

          if (subjectsList.length > 0) {
            setSubjects(subjectsList);
            setSourceType('subjects');
            loaded = true;
          }
        } catch (error) {
          console.error('Falha ao carregar subjects:', error);
        }

        if (!loaded) {
          try {
            const topicsResponse = await api.topics.getAll();
            const topicsList = extractList(topicsResponse);

            if (topicsList.length > 0) {
              setSubjects(topicsList);
              setSourceType('topics');
              loaded = true;
            }
          } catch (error) {
            console.error('Falha ao carregar topics:', error);
          }
        }

        if (!loaded) {
          try {
            const contentResponse = await api.topicContent.getAll();
            const contentList = extractList(contentResponse);

            const modulesById = new Map();
            const orphanContents = [];
            contentList.forEach((item) => {
              const key = resolveContentTopicKey(item);
              if (!key) {
                orphanContents.push(item);
                return;
              }

              const stringKey = String(key);
              if (!modulesById.has(stringKey)) {
                modulesById.set(stringKey, {
                  id: stringKey,
                  name: item?.topic?.name || item?.name || item?.title || `Módulo ${stringKey}`,
                  description: item?.description || 'Conteúdo cadastrado no gerenciador'
                });
              }
            });

            if (orphanContents.length > 0 && !modulesById.has('__all__')) {
              modulesById.set('__all__', {
                id: '__all__',
                name: 'Materiais',
                description: 'Conteúdos do gerenciador sem módulo vinculado'
              });
            }

            const moduleList = Array.from(modulesById.values());
            if (moduleList.length > 0) {
              setSubjects(moduleList);
              setSourceType('module-content');
              loaded = true;
            }
          } catch (error) {
            console.error('Falha ao carregar topic-content:', error);
          }
        }

        if (!loaded) {
          setSubjects([]);
        }
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
                onClick={() => {
                  if (sourceType === 'subjects') {
                    navigate(`/study-zone/${subject.id}`);
                    return;
                  }

                  if (sourceType === 'module-content' && subject.id === '__all__') {
                    navigate('/topic/all');
                    return;
                  }

                  navigate(`/topic/${subject.id}`);
                }}
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
