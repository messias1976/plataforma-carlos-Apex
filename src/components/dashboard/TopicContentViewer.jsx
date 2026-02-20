import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Video, Image as ImageIcon } from 'lucide-react';
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Topic Info
        const topicData = await api.topics.getById(topicId);
        setTopic(topicData);

        // Fetch Content
        const contentData = await api.topicContent.getAll(topicId);
        setContent(contentData || []);
      } catch (error) {
        console.error('Error fetching topic content:', error);
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
              {currentItem.type === 'video' && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                  <iframe
                    src={currentItem.url?.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

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