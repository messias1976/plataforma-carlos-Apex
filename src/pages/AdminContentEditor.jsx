// src/pages/AdminContentEditor.jsx

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useContentManagement } from '@/hooks/useContentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FileText, Video, Mic, File, Save, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';

const AdminContentEditor = () => {
  const { createContent, fetchContentByTopic, uploadFile, deleteContent } = useContentManagement();
  const [existingContent, setExistingContent] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const { toast } = useToast();

  const modules = [
    { id: 1, name: '📘 MÓDULO 1 — FOCO', description: 'o maior problema do aluno' },
    { id: 2, name: '📘 MÓDULO 2 — TEMPO', description: 'por que parece que nunca sobra' },
    { id: 3, name: '📘 MÓDULO 3 — ATENÇÃO', description: 'como estudar mesmo sendo distraído' },
    { id: 4, name: '📘 MÓDULO 4 — MEMÓRIA', description: 'por que você esquece tudo' },
    { id: 5, name: '📘 MÓDULO 5 — PROVA', description: 'como não travar na hora H' },
    { id: 6, name: '📘 MÓDULO 6 — CONSTÂNCIA', description: 'como não desistir' },
    { id: 7, name: '📘 MÓDULO 7 — MENTALIDADE', description: 'parar de se sentir incapaz' }
  ];

  useEffect(() => {
    if (selectedModule) {
      loadModuleContent(selectedModule);
    } else {
      setExistingContent([]);
    }
  }, [selectedModule]);

  const loadModuleContent = async (moduleId) => {
    const data = await fetchContentByTopic(moduleId);
    setExistingContent(data || []);
  };

  const handleSave = async () => {
    if (!selectedModule || !title) {
      toast({ title: "Erro", description: "Selecione um módulo e defina um título.", variant: "destructive" });
      return;
    }

    if (activeTab !== 'text') {
      if (!url && !file) {
        toast({ title: "Erro", description: "Informe uma URL valida ou envie um arquivo.", variant: "destructive" });
        return;
      }
    }

    setIsSaving(true);
    try {
      let finalUrl = url;

      if (file) {
        const uploadedUrl = await uploadFile(file, activeTab);
        if (!uploadedUrl) {
          throw new Error('Falha ao enviar arquivo.');
        }
        finalUrl = uploadedUrl;
      }

      const contentData = {
        module_id: parseInt(selectedModule, 10),
        title,
        description,
        type: activeTab,
        url: finalUrl,
        content_text: activeTab === 'text' ? textContent : null,
        order_index: existingContent.length + 1
      };

      await createContent(contentData);

      setTitle('');
      setDescription('');
      setTextContent('');
      setUrl('');
      setFile(null);
      loadModuleContent(selectedModule);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setContentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (contentToDelete) {
      await deleteContent(contentToDelete);
      loadModuleContent(selectedModule);
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 pb-24">
      <Helmet><title>Editor de Conteúdo - Admin</title></Helmet>
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-neon-500" /> Gerenciar Conteúdo
        </h1>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div>
            <Label>Módulo de Estudo</Label>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecione o módulo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {modules.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    <div className="flex flex-col">
                      <span>{m.name}</span>
                      <span className="text-xs text-slate-400">{m.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
        {selectedModule && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start p-1">
                  <TabsTrigger value="text"><FileText className="w-4 h-4 mr-2" />Texto</TabsTrigger>
                  <TabsTrigger value="document"><File className="w-4 h-4 mr-2" />Doc</TabsTrigger>
                  <TabsTrigger value="audio"><Mic className="w-4 h-4 mr-2" />Áudio</TabsTrigger>
                  <TabsTrigger value="video"><Video className="w-4 h-4 mr-2" />Vídeo</TabsTrigger>
                </TabsList>
                <Card className="bg-slate-900 border-slate-800 mt-4">
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <Label>Título do Conteúdo</Label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div>
                      <Label>Descrição Curta</Label>
                      <Input value={description} onChange={e => setDescription(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    {activeTab === 'text' && (
                      <div className="bg-white rounded-lg text-black">
                        <ReactQuill theme="snow" value={textContent} onChange={setTextContent} className="h-64 mb-12" />
                      </div>
                    )}
                    {activeTab === 'video' && (
                      <div className="space-y-4">
                        <div>
                          <Label>URL do Vídeo (Youtube/Vimeo)</Label>
                          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
                        </div>
                        <div className="text-center text-sm text-slate-500">- OU -</div>
                        <div>
                          <Label>Upload de Vídeo (mp4 )</Label>
                          <Input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} className="bg-slate-800 border-slate-700 text-white cursor-pointer" />
                        </div>
                      </div>
                    )}
                    {(activeTab === 'audio' || activeTab === 'document') && (
                      <div className="space-y-4">
                        <div>
                          <Label>URL do {activeTab === 'audio' ? 'Audio' : 'Documento'}</Label>
                          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
                        </div>
                        <div className="text-center text-sm text-slate-500">- OU -</div>
                        <div>
                          <Label>Arquivo ({activeTab === 'audio' ? 'MP3/WAV' : 'PDF/DOC'})</Label>
                          <Input type="file" accept={activeTab === 'audio' ? "audio/*" : ".pdf,.doc,.docx"} onChange={e => setFile(e.target.files[0])} className="bg-slate-800 border-slate-700 text-white cursor-pointer" />
                        </div>
                      </div>
                    )}
                    <Button onClick={handleSave} disabled={isSaving} className="w-full bg-neon-600 hover:bg-neon-700">
                      {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Conteúdo
                    </Button>
                  </CardContent>
                </Card>
              </Tabs>
            </div>
            <div className="lg:col-span-1">
              <Card className="bg-slate-900 border-slate-800 h-full">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="font-bold">Conteúdos Existentes</h3>
                </div>
                <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {existingContent.length === 0 && <p className="text-sm text-slate-500">Nenhum conteúdo neste módulo.</p>}
                  {existingContent.map(item => (
                    <div key={item.id} className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center group">
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'text' && <FileText className="w-3 h-3 text-green-500" />}
                          {item.type === 'video' && <Video className="w-3 h-3 text-blue-500" />}
                          {item.type === 'audio' && <Mic className="w-3 h-3 text-purple-500" />}
                          {item.type === 'document' && <File className="w-3 h-3 text-orange-500" />}
                          <span className="font-medium text-sm truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{item.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteClick(item.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-slate-900 border-slate-800">
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tem certeza que deseja deletar este conteúdo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Deletar</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminContentEditor;
