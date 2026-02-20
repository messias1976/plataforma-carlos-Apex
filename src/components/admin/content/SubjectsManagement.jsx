import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, ChevronRight, Layers, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import SubjectForm from './SubjectForm';
import TopicForm from './TopicForm';
import SubjectEditor from './SubjectEditor';

const SubjectsManagement = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState({});
    const [loading, setLoading] = useState(true);

    // Modals State
    const [subjectFormOpen, setSubjectFormOpen] = useState(false);
    const [topicFormOpen, setTopicFormOpen] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);

    const [editingSubject, setEditingSubject] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [selectedSubjectIdForTopic, setSelectedSubjectIdForTopic] = useState(null);
    const [selectedTopicForEditor, setSelectedTopicForEditor] = useState(null);

    const areas = [
        { id: 'linguagens', label: t('areas.linguagens'), color: 'text-blue-400', border: 'border-blue-500/20' },
        { id: 'matematica', label: t('areas.matematica'), color: 'text-purple-400', border: 'border-purple-500/20' },
        { id: 'natureza', label: t('areas.natureza'), color: 'text-emerald-400', border: 'border-emerald-500/20' },
        { id: 'humanas', label: t('areas.humanas'), color: 'text-orange-400', border: 'border-orange-500/20' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Subjects
            const subData = await api.subjects.getAll();
            setSubjects(subData || []);

            // Fetch Topics for all subjects
            if (subData?.length) {
                const topicData = await api.topics.getAll();
                // Group topics by subject_id
                const topicsMap = {};
                topicData?.forEach(topic => {
                    if (!topicsMap[topic.subject_id]) topicsMap[topic.subject_id] = [];
                    topicsMap[topic.subject_id].push(topic);
                });
                setTopics(topicsMap);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubject = (sub) => {
        setEditingSubject(sub);
        setSubjectFormOpen(true);
    };

    const handleDeleteSubject = async (id) => {
        try {
            await api.subjects.delete(id);
            toast({ title: t('common.success'), description: t('admin.subjects.deleteSubject') });
            fetchData();
        } catch (error) {
            toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        }
    };

    const handleAddTopic = (subjectId) => {
        setEditingTopic(null);
        setSelectedSubjectIdForTopic(subjectId);
        setTopicFormOpen(true);
    };

    const handleEditTopic = (topic) => {
        setEditingTopic(topic);
        setSelectedSubjectIdForTopic(topic.subject_id);
        setTopicFormOpen(true);
    };

    const handleDeleteTopic = async (id) => {
        try {
            await api.topics.delete(id);
            toast({ title: t('common.success') });
            fetchData();
        } catch (error) {
            toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        }
    };

    const handleOpenEditor = (topic) => {
        setSelectedTopicForEditor(topic);
        setEditorOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-neon-500" />
                    {t('admin.subjects.title')}
                </h2>
                <Button onClick={() => { setEditingSubject(null); setSubjectFormOpen(true); }} className="bg-neon-600 hover:bg-neon-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> {t('admin.subjects.addSubject')}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {areas.map(area => {
                    const areaSubjects = subjects.filter(s => s.area === area.id);
                    return (
                        <Card key={area.id} className={`bg-slate-900 border-slate-800 ${area.border}`}>
                            <CardHeader className="py-4 border-b border-slate-800/50">
                                <CardTitle className={`text-lg font-bold flex items-center ${area.color}`}>
                                    {area.label}
                                    <Badge variant="outline" className="ml-3 border-slate-700 text-slate-400">
                                        {areaSubjects.length} Matérias
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {areaSubjects.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500 italic">
                                        {t('admin.subjects.noSubjects')}
                                    </div>
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {areaSubjects.map(subject => (
                                            <AccordionItem key={subject.id} value={subject.id} className="border-b border-slate-800 last:border-0">
                                                <div className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                                                    <AccordionTrigger className="hover:no-underline py-0 flex-1">
                                                        <span className="font-semibold text-white">{subject.name}</span>
                                                    </AccordionTrigger>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Button size="sm" variant="ghost" onClick={() => handleEditSubject(subject)}>
                                                            <Edit className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="sm" variant="ghost">
                                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
                                                                    <AlertDialogDescription>{t('admin.subjects.confirmDeleteSubject')}</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="bg-slate-800 border-slate-700">{t('common.cancel')}</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteSubject(subject.id)}>
                                                                        {t('common.delete')}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                                <AccordionContent className="bg-slate-950/50 p-4 border-t border-slate-800/50">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.subjects.topics')}</h4>
                                                        <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700" onClick={() => handleAddTopic(subject.id)}>
                                                            <Plus className="w-3 h-3 mr-1" /> {t('admin.subjects.addTopic')}
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {(topics[subject.id] || []).length === 0 ? (
                                                            <p className="text-sm text-slate-600">{t('admin.subjects.noTopics')}</p>
                                                        ) : (
                                                            (topics[subject.id] || []).map(topic => (
                                                                <div key={topic.id} className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-800 group hover:border-slate-600 transition-all">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-mono">
                                                                            {topic.order_index}
                                                                        </span>
                                                                        <span className="text-slate-200">{topic.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button
                                                                            size="sm"
                                                                            className="h-8 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30"
                                                                            onClick={() => handleOpenEditor(topic)}
                                                                        >
                                                                            <FileText className="w-3 h-3 mr-2" />
                                                                            {t('admin.subjects.manageContent')}
                                                                        </Button>
                                                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditTopic(topic)}>
                                                                            <Edit className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => handleDeleteTopic(topic.id)}>
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <SubjectForm
                isOpen={subjectFormOpen}
                onClose={() => setSubjectFormOpen(false)}
                subject={editingSubject}
                onSuccess={fetchData}
            />

            <TopicForm
                isOpen={topicFormOpen}
                onClose={() => setTopicFormOpen(false)}
                topic={editingTopic}
                subjectId={selectedSubjectIdForTopic}
                onSuccess={fetchData}
            />

            <SubjectEditor
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                topic={selectedTopicForEditor}
            />
        </div>
    );
};

export default SubjectsManagement;