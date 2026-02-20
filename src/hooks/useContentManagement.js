// src/hooks/useContentManagement.js

import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/MockAuthContext';
import { API_BASE } from '@/lib/api';

export const useContentManagement = () => {
  const { toast } = useToast();
  const { api } = useAuth();

  const fetchContentByTopic = async (moduleId) => {
    if (!moduleId) return [];
    try {
      const data = await api(`/content?moduleId=${moduleId}`);
      return data?.data || [];
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
      const token = localStorage.getItem('token');
      const uploadRequest = async (baseUrl) => {
        const response = await fetch(`${baseUrl}/uploads`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        });

        let payload = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        return { response, payload };
      };

      const { response, payload } = await uploadRequest(API_BASE);

      if (!response.ok) {
        const backendMessage = payload?.error || payload?.message || payload?.errors?.details || null;

        if (response.status === 401) {
          throw new Error(backendMessage || 'Sessão expirada. Faça login novamente para enviar arquivos.');
        }

        if (response.status === 403 || response.status === 404) {
          throw new Error(backendMessage || 'Endpoint de upload indisponível no servidor. Verifique a rota /api/uploads e permissões da pasta uploads.');
        }

        throw new Error(backendMessage || `Falha ao enviar arquivo (HTTP ${response.status}).`);
      }

      const data = payload || {};

      const uploadedUrl = data?.url || data?.data?.url;

      if (!uploadedUrl) {
        throw new Error('Resposta inválida do servidor.');
      }

      toast({ title: 'Sucesso!', description: 'Arquivo enviado.' });
      return uploadedUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({ title: 'Erro de upload', description: error.message, variant: 'destructive' });
      return null;
    }
  };

  // ... outras funções ...

  return { createContent, fetchContentByTopic, deleteContent, uploadFile };
};
