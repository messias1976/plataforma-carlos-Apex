import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Edit, Trash2, Save, FileText, Image, Video, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/MockAuthContext';
import { askChatGPT } from '@/lib/chatgpt';

const AdminContentManagement = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { api } = useAuth();

    // State
    const [activeTab, setActiveTab] = useState('modules');
    const [selectedModule, setSelectedModule] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingContent, setEditingContent] = useState(null); // null = creating

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'text',
        url: '',
        content_text: '',
        order_index: 0
    });

    const modules = [
        { id: 1, name: '📘 MÓDULO 1 — FOCO', description: 'o maior problema do aluno' },
        { id: 2, name: '📘 MÓDULO 2 — TEMPO', description: 'por que parece que nunca sobra' },
        { id: 3, name: '📘 MÓDULO 3 — ATENÇÃO', description: 'como estudar mesmo sendo distraído' },
        { id: 4, name: '📘 MÓDULO 4 — MEMÓRIA', description: 'por que você esquece tudo' },
        { id: 5, name: '📘 MÓDULO 5 — PROVA', description: 'como não travar na hora H' },
        { id: 6, name: '📘 MÓDULO 6 — CONSTÂNCIA', description: 'como não desistir' },
        { id: 7, name: '📘 MÓDULO 7 — MENTALIDADE', description: 'parar de se sentir incapaz' }
    ];

    // Fetch Contents when Module changes
    useEffect(() => {
        if (selectedModule) {
            fetchContents();
            setActiveTab('contents');
        }
    }, [selectedModule]);

    const fetchContents = async () => {
        setLoading(true);
        if (!selectedModule) return;

        try {
            const data = await api(`/content?moduleId=${selectedModule}`);
            setContents(data || []);
        } catch (error) {
            toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        }

        setLoading(false);
    };

    const handleCreateTopic = async () => {
        // Placeholder for topic creation logic
        // Would need a dialog similar to content
        toast({ title: "Feature not fully implemented in this demo", description: "Use database seeds for topics." });
    };

    const handleSaveContent = async () => {
        if (!selectedModule) return;
        setLoading(true);

        const payload = {
            ...formData,
            module_id: selectedModule
        };

        try {
            if (editingContent) {
                await api(`/content/${editingContent.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                await api('/content', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }

            toast({ title: t('admin.content.messages.saved'), className: "bg-green-600 text-white" });
            setEditingContent(null);
            setFormData({ title: '', description: '', type: 'text', url: '', content_text: '', order_index: 0 });
            fetchContents();
        } catch (error) {
            toast({ title: t('admin.content.messages.error'), description: error.message, variant: 'destructive' });
        }

        setLoading(false);
    };

    const handleDeleteContent = async (id) => {
        try {
            await api(`/content/${id}`, {
                method: 'DELETE'
            });
            toast({ title: t('admin.content.messages.deleted') });
            fetchContents();
        } catch (error) {
            toast({ title: t('admin.content.messages.error'), variant: 'destructive' });
        }
    };

    const prepareEdit = (content) => {
        setEditingContent(content);
        setFormData({
            title: content.title,
            description: content.description || '',
            type: content.type,
            url: content.url || '',
            content_text: content.content_text || '',
            order_index: content.order_index || 0
        });
    };

    const cancelEdit = () => {
        setEditingContent(null);
        setFormData({ title: '', description: '', type: 'text', url: '', content_text: '', order_index: 0 });
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-900 border-slate-800">
                    <TabsTrigger value="modules" onClick={() => { setSelectedModule(null); }}>
                        Módulos de Estudo
                    </TabsTrigger>
                    <TabsTrigger value="contents" disabled={!selectedModule}>
                        {selectedModule ? `Conteúdo do Módulo ${selectedModule}` : 'Gerenciar Conteúdo'}
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Modules */}
                <TabsContent value="modules" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.map(module => (
                            <Card
                                key={module.id}
                                className="bg-slate-900 border-slate-800 hover:border-purple-500 cursor-pointer transition-all hover:scale-105"
                                onClick={() => setSelectedModule(module.id)}
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-40">
                                    <div className="text-2xl mb-2">{module.name.split(' ')[0]}</div>
                                    <h3 className="font-bold text-white text-sm">{module.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1">{module.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab 2: Contents */}
                <TabsContent value="contents" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Content List */}
                        <Card className="bg-slate-900 border-slate-800 h-fit">
                            <CardHeader>
                                <CardTitle className="text-white flex justify-between items-center">
                                    {t('admin.content.contentList')}
                                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {loading ? <Loader2 className="animate-spin text-purple-500 mx-auto" /> : (
                                    contents.length === 0 ? <p className="text-slate-500">{t('admin.content.noContent')}</p> : contents.map(content => (
                                        <div key={content.id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-purple-900/30 p-2 rounded text-purple-400">
                                                    {content.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-white truncate">{content.title}</p>
                                                    <p className="text-xs text-slate-500">{content.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => prepareEdit(content)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>{t('admin.content.deleteContentTitle')}</AlertDialogTitle>
                                                            <AlertDialogDescription>{t('admin.content.deleteContentDesc')}</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700">{t('common.cancel')}</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteContent(content.id)}>{t('common.delete')}</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Content Form */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    {editingContent ? t('admin.content.editContent') : t('admin.content.addContent')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">{t('admin.content.form.title')}</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">{t('admin.content.form.type')}</Label>
                                        <Select value={formData.type} onValueChange={val => setFormData({ ...formData, type: val })}>
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                <SelectItem value="text">{t('admin.content.types.text')}</SelectItem>
                                                <SelectItem value="video">{t('admin.content.types.video')}</SelectItem>
                                                <SelectItem value="image">{t('admin.content.types.image')}</SelectItem>
                                                <SelectItem value="exercise">{t('admin.content.types.exercise')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">{t('admin.content.form.order')}</Label>
                                        <Input
                                            type="number"
                                            value={formData.order_index}
                                            onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">{t('admin.content.form.url')}</Label>
                                    <Input
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-300">{t('admin.content.form.body')}</Label>
                                    <div className="bg-slate-800 rounded-md text-white">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.content_text}
                                            onChange={val => setFormData({ ...formData, content_text: val })}
                                            className="text-white"
                                        />
                                    </div>
                                    <Button
                                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                                        type="button"
                                        onClick={async () => {
                                            // Geração automática de conteúdo com IA
                                            const prompt = `Gere um conteúdo educacional para o tema: ${formData.title}. Tipo: ${formData.type}. Nível: ${formData.order_index}. Se for exercício ou prova, crie questões e alternativas. Se for resumo, faça um resumo didático. Se for avaliação, crie perguntas e respostas. Seja claro, objetivo e didático.`;
                                            const aiContent = await askChatGPT([
                                                { role: 'system', content: 'Você é um agente de IA educacional completo. Crie conteúdos, provas, exercícios, avaliações, resumos, explicações e sugestões conforme solicitado.' },
                                                { role: 'user', content: prompt }
                                            ], api);
                                            setFormData({ ...formData, content_text: aiContent });
                                        }}
                                    >
                                        Gerar com IA
                                    </Button>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        onClick={handleSaveContent}
                                        disabled={loading || !formData.title}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        {t('admin.content.form.save')}
                                    </Button>
                                    {editingContent && (
                                        <Button onClick={cancelEdit} variant="outline" className="border-slate-700 text-slate-300">
                                            {t('common.cancel')}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminContentManagement;