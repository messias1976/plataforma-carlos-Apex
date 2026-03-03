import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { API_BASE } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Video, Mic, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import ProtectedPlanRoute from '@/components/subscription/ProtectedPlanRoute';

const TopicContentViewer = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  const [content, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [completed, setCompleted] = useState(false);

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

  const resolveContentUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    if (rawUrl.startsWith('/')) return rawUrl;
    return `${API_BASE.replace(/\/+$/, '')}/${rawUrl.replace(/^\/+/, '')}`;
  };

  const buildProtectedUrl = (rawUrl) => {
    if (!rawUrl) return rawUrl;

    const token = localStorage.getItem('token');
    const resolvedUrl = resolveContentUrl(rawUrl);
    if (!token) return resolvedUrl;

    const separator = resolvedUrl.includes('?') ? '&' : '?';
    return `${resolvedUrl}${separator}token=${encodeURIComponent(token)}`;
  };

  const getVideoEmbedUrl = (rawUrl) => {
    if (!rawUrl) return null;

    if (rawUrl.includes('youtube.com/watch?v=')) {
      return rawUrl.replace('watch?v=', 'embed/');
    }

    if (rawUrl.includes('youtu.be/')) {
      const id = rawUrl.split('youtu.be/')[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (rawUrl.includes('vimeo.com/')) {
      const id = rawUrl.split('vimeo.com/')[1]?.split(/[?&]/)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Topic Info (best effort)
        if (topicId === 'all') {
          setTopic({ id: 'all', name: 'Materiais' });
        } else {
          const topicResponse = await api.topics.getById(topicId);
          const topicData = topicResponse?.data || topicResponse || null;
          setTopic(topicData);
        }
      } catch (error) {
        setTopic({ id: topicId, name: `Módulo ${topicId}` });
      }

      try {
        // Fetch Content
        const contentResponse = topicId === 'all'
          ? await api.topicContent.getAll()
          : await api.topicContent.getAll(topicId);
        const contentData = Array.isArray(contentResponse?.data)
          ? contentResponse.data
          : (Array.isArray(contentResponse) ? contentResponse : []);

        const normalizedContent = contentData.map((item) => {
          const parsedData = parseDataField(item?.data);
          const rawType = String(item?.type || '').toLowerCase();
          const contentType = String(
            item?.content_type ||
            parsedData?.content_type ||
            (rawType !== 'content' && rawType !== 'lesson' ? item?.type : null) ||
            parsedData?.type ||
            'text'
          ).toLowerCase();
          const contentUrl = item?.url || item?.file_url || item?.fileUrl || parsedData?.url || parsedData?.file_url || parsedData?.fileUrl || '';
          const contentText = item?.content_text || parsedData?.content_text || null;

          return {
            ...item,
            type: contentType,
            url: contentUrl,
            content_text: contentText,
          };
        });

        setContent(normalizedContent);
      } catch (error) {
        console.error('Error fetching topic content:', error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCompleted(false);
    }
  };

  const currentItem = content[currentIndex];

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">{t('common.loading')}</div>;

  return (
    <ProtectedPlanRoute feature="studyZone">
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        {completed && <ReactConfetti width={width} height={height} recycle={false} />}

        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center px-4 bg-slate-900 justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Button>
            <div>
              <h1 className="font-bold text-sm md:text-lg">{topic?.name || 'Topic'}</h1>
              <p className="text-xs text-slate-500">{currentIndex + 1} / {content.length}</p>
            </div>
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / content.length) * 100}%` }}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          {completed ? (
            <Card className="p-8 text-center bg-slate-900 border-neon-500/50 max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">{t('common.completed')}!</h2>
              <p className="text-slate-400 mb-6">Você completou este tópico.</p>
              <Button onClick={() => navigate('/dashboard')} className="w-full bg-neon-600 text-white hover:bg-neon-500">
                {t('common.backToDashboard')}
              </Button>
            </Card>
          ) : currentItem ? (
            <div className="w-full max-w-4xl space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{currentItem.title}</h2>

              {/* Content Renderers */}
              {currentItem.type === 'video' && (() => {
                const embedUrl = getVideoEmbedUrl(currentItem.url);

                if (embedUrl) {
                  return (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentItem.title || 'Vídeo'}
                      />
                    </div>
                  );
                }

                return (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
                    <video controls className="w-full h-full" src={buildProtectedUrl(currentItem.url)}>
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                  </div>
                );
              })()}

              {currentItem.type === 'image' && (
                <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                  <img src={currentItem.url} alt={currentItem.title} className="w-full h-auto" />
                </div>
              )}

              {(currentItem.type === 'text' || currentItem.content_text) && (
                <div className="prose prose-invert max-w-none bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: currentItem.content_text || currentItem.description }} />
                </div>
              )}

              {currentItem.type === 'audio' && (
                <Card className="p-6 bg-slate-900 border-slate-700">
                  <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Mic className="w-5 h-5" />
                    <span className="font-bold">Áudio</span>
                  </div>
                  <p className="text-slate-300 mb-4">{currentItem.description || 'Ouça o conteúdo abaixo.'}</p>
                  <audio controls className="w-full">
                    <source src={buildProtectedUrl(currentItem.url)} />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </Card>
              )}

              {currentItem.type === 'document' && (
                <Card className="p-6 bg-slate-900 border-slate-700">
                  <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <FileText className="w-5 h-5" />
                    <span className="font-bold">Documento</span>
                  </div>
                  <p className="text-slate-300 mb-4">{currentItem.description || 'Abra o documento para leitura.'}</p>
                  {currentItem.url && (
                    <Button asChild variant="outline" className="border-slate-600 text-slate-200">
                      <a href={buildProtectedUrl(currentItem.url)} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" /> Abrir documento
                      </a>
                    </Button>
                  )}
                </Card>
              )}

              {currentItem.type === 'exercise' && (
                <Card className="p-6 bg-slate-900 border-slate-700">
                  <div className="flex items-center gap-2 mb-4 text-yellow-400">
                    <FileText className="w-5 h-5" />
                    <span className="font-bold">Exercício Prático</span>
                  </div>
                  <p className="text-slate-300 mb-4">{currentItem.description}</p>
                  {currentItem.url && (
                    <Button variant="outline" onClick={() => window.open(currentItem.url, '_blank')}>
                      Abrir Exercício
                    </Button>
                  )}
                </Card>
              )}
            </div>
          ) : (
            <p className="text-slate-500">Nenhum conteúdo disponível.</p>
          )}
        </main>

        {/* Footer Navigation */}
        <footer className="h-20 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-6 md:px-12">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0 || completed}
            className="border-slate-700 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>

          {!completed && (
            <Button
              onClick={handleNext}
              className="bg-neon-600 hover:bg-neon-500 text-white px-8"
            >
              {currentIndex === content.length - 1 ? 'Concluir' : 'Próximo'} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </footer>
      </div>
    </ProtectedPlanRoute>
  );
};

export default TopicContentViewer;