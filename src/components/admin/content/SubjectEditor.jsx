import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, Video, Mic, File, UploadCloud, Save, Trash2, Edit } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useContentManagement } from '@/hooks/useContentManagement';

const SubjectEditor = ({ isOpen, onClose, topic }) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { uploadFile } = useContentManagement();

    const [activeTab, setActiveTab] = useState('text');
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Editor State
    const [isEditing, setIsEditing] = useState(false); // ID of content being edited or null
    const [editorData, setEditorData] = useState({
        title: '',
        description: '',
        content_text: '',
        url: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (topic && isOpen) {
            fetchContent();
        }
    }, [topic, isOpen]);

    const fetchContent = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const data = await api.topicContent.getAll(topic.id);
            setContentList(data || []);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editorData.title) {
            toast({ title: t('common.error'), description: "Título é obrigatório", variant: "destructive" });
            return;
        }

        setUploading(true);
        try {
            let finalUrl = editorData.url;

            if (selectedFile) {
                const bucketMap = {
                    video: 'videos',
                    audio: 'audios',
                    document: 'documents'
                };
                // Default to documents if tab mismatch (shouldn't happen with UI logic)
                const bucket = bucketMap[activeTab] || 'documents';
                finalUrl = await uploadFile(selectedFile, bucket);
            }

            const payload = {
                topic_id: topic.id,
                title: editorData.title,
                description: editorData.description,
                content_type: activeTab,
                url: finalUrl,
                content_text: activeTab === 'text' ? editorData.content_text : null,
                order_index: contentList.length + 1
            };

            if (isEditing && typeof isEditing === 'string') {
                await api.topicContent.update(isEditing, payload);
            } else {
                await api.topicContent.create(payload);
            }

            toast({ title: t('admin.editor.saveSuccess'), className: "bg-green-600 text-white" });
            resetForm();
            fetchContent();
        } catch (err) {
            console.error(err);
            toast({ title: t('common.error'), description: err.message, variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.topicContent.delete(id);
            toast({ title: t('common.success') });
            fetchContent();
        } catch (error) {
            toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        }
    };

    const handleEdit = (item) => {
        setIsEditing(item.id);
        setActiveTab(item.content_type || item.type);
        setEditorData({
            title: item.title,
            description: item.description || '',
            content_text: item.content_text || '',
            url: item.url || ''
        });
        setSelectedFile(null);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditorData({ title: '', description: '', content_text: '', url: '' });
        setSelectedFile(null);
    };

    const renderUploadArea = (acceptType, label) => (
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-neon-500 transition-colors bg-slate-950">
            <Input
                type="file"
                accept={acceptType}
                className="hidden"
                id="file-upload"
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="w-12 h-12 text-slate-500" />
                <span className="text-slate-300">{selectedFile ? selectedFile.name : label}</span>
                <span className="text-xs text-slate-500">{t('admin.editor.uploadDrop')}</span>
            </Label>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] bg-slate-900 border-slate-800 text-white flex flex-col p-0" aria-describedby="subject-editor-desc">
                <div className="p-6 border-b border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{t('admin.editor.title')}: <span className="text-neon-400">{topic?.name}</span></DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Gerencie textos, vídeos, áudios e documentos para este tópico.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Content List */}
                    <div className="w-1/3 border-r border-slate-800 p-4 overflow-y-auto bg-slate-950/50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-slate-400 uppercase">Conteúdos Existentes</h3>
                            <Button size="sm" variant="ghost" onClick={resetForm} className="h-6 text-xs bg-slate-800">
                                Novo
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {contentList.map(item => (
                                <div key={item.id} className="p-3 bg-slate-900 rounded border border-slate-800 hover:border-slate-600 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs uppercase bg-slate-800 px-1.5 rounded text-slate-400 border border-slate-700">{item.type}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEdit(item)}>
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="font-medium text-sm truncate">{item.title}</p>
                                </div>
                            ))}
                            {contentList.length === 0 && <p className="text-sm text-slate-500 text-center py-4">Vazio</p>}
                        </div>
                    </div>

                    {/* Right: Editor */}
                    <div className="w-2/3 p-6 overflow-y-auto">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-slate-950 border border-slate-800 w-full justify-start mb-6">
                                <TabsTrigger value="text" className="data-[state=active]:bg-neon-600"><FileText className="w-4 h-4 mr-2" /> {t('admin.editor.tabs.text')}</TabsTrigger>
                                <TabsTrigger value="document" className="data-[state=active]:bg-orange-600"><File className="w-4 h-4 mr-2" /> {t('admin.editor.tabs.docs')}</TabsTrigger>
                                <TabsTrigger value="audio" className="data-[state=active]:bg-purple-600"><Mic className="w-4 h-4 mr-2" /> {t('admin.editor.tabs.audio')}</TabsTrigger>
                                <TabsTrigger value="video" className="data-[state=active]:bg-blue-600"><Video className="w-4 h-4 mr-2" /> {t('admin.editor.tabs.video')}</TabsTrigger>
                            </TabsList>

                            <div className="space-y-4">
                                <div>
                                    <Label>{t('admin.subjects.form.name')}</Label>
                                    <Input
                                        value={editorData.title}
                                        onChange={e => setEditorData({ ...editorData, title: e.target.value })}
                                        className="bg-slate-950 border-slate-700"
                                    />
                                </div>
                                <div>
                                    <Label>{t('admin.subjects.form.description')}</Label>
                                    <Input
                                        value={editorData.description}
                                        onChange={e => setEditorData({ ...editorData, description: e.target.value })}
                                        className="bg-slate-950 border-slate-700"
                                    />
                                </div>

                                <TabsContent value="text" className="mt-0">
                                    <Label className="mb-2 block">Conteúdo Texto</Label>
                                    <div className="bg-slate-100 rounded text-black h-64 mb-12">
                                        <ReactQuill
                                            theme="snow"
                                            value={editorData.content_text}
                                            onChange={val => setEditorData({ ...editorData, content_text: val })}
                                            className="h-52"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="document" className="mt-0">
                                    {renderUploadArea(".pdf,.doc,.docx,.ppt,.pptx", "Selecionar Documento")}
                                    {editorData.url && !selectedFile && <p className="text-xs text-green-400 mt-2">Arquivo atual: {editorData.url}</p>}
                                </TabsContent>

                                <TabsContent value="audio" className="mt-0">
                                    {renderUploadArea("audio/*", "Selecionar Áudio (MP3/WAV)")}
                                    {editorData.url && !selectedFile && <p className="text-xs text-green-400 mt-2">Arquivo atual: {editorData.url}</p>}
                                </TabsContent>

                                <TabsContent value="video" className="mt-0 space-y-4">
                                    <div>
                                        <Label>URL do Vídeo (Youtube/Vimeo)</Label>
                                        <Input
                                            value={editorData.url}
                                            onChange={e => setEditorData({ ...editorData, url: e.target.value })}
                                            placeholder={t('admin.editor.urlPlaceholder')}
                                            className="bg-slate-950 border-slate-700"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-slate-800" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-slate-900 px-2 text-slate-500">Ou upload direto</span>
                                        </div>
                                    </div>
                                    {renderUploadArea("video/*", t('admin.editor.videoUpload'))}
                                </TabsContent>

                                <div className="pt-4">
                                    <Button onClick={handleSave} disabled={uploading} className="w-full bg-neon-600 hover:bg-neon-700 text-white">
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        {t('common.save')}
                                    </Button>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SubjectEditor;