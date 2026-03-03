import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, FileText, Video, Mic, Download } from 'lucide-react';
import { API_BASE } from '@/lib/api';

const ContentViewerModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;

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

  const resolvedData = parseDataField(content.data);
  const rawType = String(content.type || '').toLowerCase();
  const resolvedType = String(
    content.content_type ||
    resolvedData.content_type ||
    (rawType !== 'content' && rawType !== 'lesson' ? content.type : null) ||
    resolvedData.type ||
    'text'
  ).toLowerCase();
  const rawResolvedUrl = content.url || content.file_url || content.fileUrl || resolvedData.url || resolvedData.file_url || resolvedData.fileUrl || '';

  const resolveContentUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
    if (rawUrl.startsWith('/')) return rawUrl;
    return `${API_BASE.replace(/\/+$/, '')}/${rawUrl.replace(/^\/+/, '')}`;
  };

  const resolvedUrl = resolveContentUrl(rawResolvedUrl);

  const buildProtectedUrl = (rawUrl) => {
    if (!rawUrl) return rawUrl;

    const token = localStorage.getItem('token');
    if (!token) return rawUrl;

    const url = resolveContentUrl(rawUrl);
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${encodeURIComponent(token)}`;
  };

  const renderContent = () => {
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

    switch (resolvedType) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none p-4 bg-slate-900 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: content.content_text || resolvedData.content_text || content.description || '' }} />
          </div>
        );

      case 'video':
        const embedUrl = getVideoEmbedUrl(resolvedUrl);

        return (
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={content.title}
              />
            ) : (
              <video controls className="w-full h-full" src={buildProtectedUrl(resolvedUrl)}>
                Seu navegador não suporta a tag de vídeo.
              </video>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg space-y-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Mic className="w-8 h-8 text-purple-400" />
            </div>
            <audio controls className="w-full max-w-md">
              <source src={buildProtectedUrl(resolvedUrl)} />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        );

      case 'document':
        return (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900 rounded-lg space-y-6 text-center">
            <FileText className="w-16 h-16 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Visualização de Documento</h3>
              <p className="text-slate-400 text-sm">Clique abaixo para acessar o arquivo.</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href={buildProtectedUrl(resolvedUrl)} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Baixar / Visualizar PDF
              </a>
            </Button>
          </div>
        );

      default:
        return <div className="p-4 text-center text-slate-500">Formato não suportado.</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] bg-slate-950 border-slate-800 text-white flex flex-col p-0 gap-0" aria-describedby="content-viewer-desc">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="w-fit -ml-2 text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {resolvedType === 'video' && <Video className="w-5 h-5 text-blue-400" />}
              {resolvedType === 'text' && <FileText className="w-5 h-5 text-green-400" />}
              {resolvedType === 'audio' && <Mic className="w-5 h-5 text-purple-400" />}
              {content.title}
            </DialogTitle>
            <DialogDescription id="content-viewer-desc" className="text-slate-400">
              {content.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 p-6">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewerModal;