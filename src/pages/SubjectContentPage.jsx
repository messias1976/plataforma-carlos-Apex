import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Video, Mic, FileText, PlayCircle } from 'lucide-react';
import ContentViewerModal from '@/components/dashboard/ContentViewerModal';
import api from '@/lib/api';

const SubjectContentPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const normalizeContentType = (item) => item?.type || item?.content_type || 'text';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch Subject Info
        const subResponse = await api.subjects.getById(subjectId);
        const subjectData = subResponse?.data || subResponse || null;
        setSubject(subjectData);

        // Fetch Topics
        const topicResponse = await api.topics.getAll(subjectId);
        const topicData = Array.isArray(topicResponse?.data)
          ? topicResponse.data
          : (Array.isArray(topicResponse) ? topicResponse : []);

        setTopics(topicData);

        if (topicData?.length > 0) {
          // Fetch All Content for these topics
          const allContent = [];
          for (const topic of topicData) {
            const contentResponse = await api.topicContent.getAll(topic.id);
            const contentData = Array.isArray(contentResponse?.data)
              ? contentResponse.data
              : (Array.isArray(contentResponse) ? contentResponse : []);

            const topicName = topic?.name || topic?.title || `Tópico ${topic.id}`;
            const withTopicName = contentData.map(c => ({
              ...c,
              type: normalizeContentType(c),
              topic: { name: topicName }
            }));
            allContent.push(...withTopicName);
          }
          setContentItems(allContent);
        } else {
          setContentItems([]);
        }
      } catch (err) {
        console.error("Error loading subject data:", err);
        setContentItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) loadData();
  }, [subjectId]);

  const filterContent = (type) => {
    if (type === 'all') return contentItems;
    return contentItems.filter(item => item.type === type);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-blue-400" />;
      case 'audio': return <Mic className="w-5 h-5 text-purple-400" />;
      case 'document': return <FileText className="w-5 h-5 text-orange-400" />;
      default: return <BookOpen className="w-5 h-5 text-green-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'audio': return 'Áudio';
      case 'document': return 'Documento';
      default: return 'Texto';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-20">
      <Helmet>
        <title>{subject?.name || 'Matéria'} - Zona de Estudo</title>
      </Helmet>

      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/study-zone')}>Zona de Estudo</span>
          <span>&gt;</span>
          <span className="text-neon-400">{subject?.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-neon-500" />
            {subject?.name || t('common.loading')}
          </h1>
          <Button variant="outline" onClick={() => navigate('/study-zone')} className="border-slate-700 text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>

        <p className="text-slate-400 max-w-2xl">{subject?.description}</p>

        {/* Filters */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900 border border-slate-800 p-1">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="text">Textos</TabsTrigger>
            <TabsTrigger value="video">Vídeos</TabsTrigger>
            <TabsTrigger value="audio">Áudios</TabsTrigger>
            <TabsTrigger value="document">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Carregando conteúdos...</div>
            ) : contentItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                Nenhum conteúdo encontrado para esta matéria ainda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterContent(activeTab === 'all' ? 'all' : activeTab).map((item) => (
                  <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-neon-500/50 transition-all p-4 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-neon-500/30">
                        {getIcon(item.type)}
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-700 capitalize">
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
                      {item.description || 'Sem descrição disponível.'}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                      <span className="text-xs text-slate-500">{item.topic?.name}</span>
                      <Button size="sm" onClick={() => setSelectedContent(item)} className="bg-neon-600 hover:bg-neon-700 text-white">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Abrir
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ContentViewerModal
        isOpen={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        content={selectedContent}
      />
    </div>
  );
};

export default SubjectContentPage;