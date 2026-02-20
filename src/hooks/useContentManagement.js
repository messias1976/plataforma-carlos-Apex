// src/hooks/useContentManagement.js

import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/MockAuthContext';

export const useContentManagement = () => {
  const { toast } = useToast();
  const { api } = useAuth();

  const fetchContentByTopic = async (moduleId) => {
    if (!moduleId) return [];
    try {
      const data = await api(`/content?moduleId=${moduleId}`);
      return data;
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({ title: "Erro de API", description: error.message, variant: "destructive" });
      return [];
    }
  };

  const createContent = async (contentData) => {
    try {
      await api('/content', {
        method: 'POST',
        body: JSON.stringify(contentData),
      });
      toast({ title: "Sucesso!", description: "Conteúdo salvo." });
    } catch (error) {
      console.error("Error creating content:", error);
      toast({ title: "Erro de API", description: error.message, variant: "destructive" });
    }
  };

  const deleteContent = async (lessonId) => {
    try {
      await api(`/content/${lessonId}`, {
        method: 'DELETE',
      });
      toast({ title: "Sucesso!", description: "Conteúdo deletado." });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({ title: "Erro de API", description: error.message, variant: "destructive" });
    }
  };

  const uploadFile = async (file, type) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    if (type) {
      formData.append('type', type);
    }

    try {
      const data = await api('/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!data.url) {
        throw new Error('Resposta inválida do servidor.');
      }

      toast({ title: 'Sucesso!', description: 'Arquivo enviado.' });
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({ title: 'Erro de upload', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  // ... outras funções ...

  return { createContent, fetchContentByTopic, deleteContent, uploadFile };
};
