import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, FileText, Video, Mic, Download } from 'lucide-react';
import { API_BASE } from '@/lib/api';

const ContentViewerModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;

  const buildProtectedUrl = (rawUrl) => {
    if (!rawUrl) return rawUrl;

    const token = localStorage.getItem('token');
    if (!token) return rawUrl;

    const url = rawUrl.startsWith('/uploads/') ? `${API_BASE}${rawUrl}` : rawUrl;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${encodeURIComponent(token)}`;
  };

  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none p-4 bg-slate-900 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: content.content_text }} />
          </div>
        );

      case 'video':
        return (
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {content.url?.includes('youtube') || content.url?.includes('vimeo') ? (
              <iframe
                src={content.url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={content.title}
              />
            ) : (
              <video controls className="w-full h-full">
                <source src={buildProtectedUrl(content.url)} type="video/mp4" />
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
              <source src={buildProtectedUrl(content.url)} type="audio/mpeg" />
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
              <a href={buildProtectedUrl(content.url)} target="_blank" rel="noopener noreferrer">
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
              {content.type === 'video' && <Video className="w-5 h-5 text-blue-400" />}
              {content.type === 'text' && <FileText className="w-5 h-5 text-green-400" />}
              {content.type === 'audio' && <Mic className="w-5 h-5 text-purple-400" />}
              {content.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
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