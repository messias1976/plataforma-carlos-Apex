import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users, BookOpen, Settings, Database, FileText, Video, Mic, File
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/dashboard/Header';
import SubjectsManagement from '@/components/admin/content/SubjectsManagement';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // Chave OpenAI removida do frontend por segurança
    // const [openaiKey, setOpenaiKey] = useState('');
    // const [showKeyConfig, setShowKeyConfig] = useState(false);

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ subjects: 0, content: 0, users: 0, activeSubs: 0 });
    const [contentBreakdown, setContentBreakdown] = useState({ text: 0, video: 0, audio: 0, document: 0 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const subsData = await api.subscriptions.getAll();
            const contentData = await api.topicContent.getAll();
            const subjectsData = await api.subjects.getAll();

            const formattedUsers = subsData?.map(sub => ({
                id: sub.user_id,
                email: sub.email || `user_${sub.user_id.substring(0, 6)}...`,
                plan: sub.plan_type,
                status: sub.status,
                created_at: sub.created_at
            })) || [];
            setUsers(formattedUsers);

            const breakdown = { text: 0, video: 0, audio: 0, document: 0 };
            contentData?.forEach(item => {
                if (breakdown[item.content_type] !== undefined) breakdown[item.content_type]++;
            });

            setStats({
                subjects: subjectsData?.length || 0,
                content: contentData?.length || 0,
                users: formattedUsers.length,
                activeSubs: formattedUsers.filter(u => u.status === 'active').length
            });
            setContentBreakdown(breakdown);

        } catch (error) {
            console.error("Admin fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.plan.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Helmet>
                <title>{t('admin.title')} - APEX</title>
            </Helmet>

            {/* Use shared Header which includes Logout logic */}
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('admin.title')}</h1>
                    <p className="text-slate-400">Gerencie usuários, conteúdo e configurações do sistema.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start h-auto p-2 gap-2 overflow-x-auto mb-6">
                        <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
                            <Users className="w-4 h-4 mr-2" /> {t('admin.tabs.users')}
                        </TabsTrigger>
                        <TabsTrigger value="subjects" className="data-[state=active]:bg-purple-600">
                            <BookOpen className="w-4 h-4 mr-2" /> {t('admin.tabs.subjects')}
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600">
                            <Database className="w-4 h-4 mr-2" /> {t('admin.tabs.resources')}
                        </TabsTrigger>
                        <TabsTrigger value="control" className="data-[state=active]:bg-purple-600">
                            <Settings className="w-4 h-4 mr-2" /> {t('admin.tabs.settings')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="subjects">
                        <SubjectsManagement />
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800">
                            <Input
                                placeholder={t('common.search')}
                                className="max-w-xs bg-slate-950 border-slate-700 text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Badge variant="outline" className="text-slate-400">{filteredUsers.length} {t('admin.users.totalUsers')}</Badge>
                        </div>
                        <Card className="bg-slate-900 border-slate-800">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">{t('admin.users.table.id')}</TableHead>
                                        <TableHead className="text-slate-400">{t('admin.users.table.plan')}</TableHead>
                                        <TableHead className="text-slate-400">{t('admin.users.table.status')}</TableHead>
                                        <TableHead className="text-slate-400">{t('admin.users.table.created')}</TableHead>
                                        <TableHead className="text-right text-slate-400">{t('admin.users.table.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user, i) => (
                                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                                            <TableCell className="font-mono text-xs">{user.id}</TableCell>
                                            <TableCell>
                                                <Badge className={user.plan === 'premium' ? 'bg-orange-500' : 'bg-blue-600'}>
                                                    {user.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={user.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost">{t('common.edit')}</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-400">{t('admin.resources.totalSubjects')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.subjects}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-400">{t('admin.resources.contentItems')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.content}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <h3 className="text-xl font-bold mt-8 mb-4">{t('admin.resources.distribution')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-slate-900 border-slate-800 flex items-center p-4 gap-4">
                                <div className="p-3 bg-green-500/10 rounded-full"><FileText className="text-green-500" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">{t('admin.resources.texts')}</p>
                                    <p className="text-xl font-bold">{contentBreakdown.text}</p>
                                </div>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800 flex items-center p-4 gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-full"><Video className="text-blue-500" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">{t('admin.resources.videos')}</p>
                                    <p className="text-xl font-bold">{contentBreakdown.video}</p>
                                </div>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800 flex items-center p-4 gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-full"><Mic className="text-purple-500" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">{t('admin.resources.audios')}</p>
                                    <p className="text-xl font-bold">{contentBreakdown.audio}</p>
                                </div>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800 flex items-center p-4 gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-full"><File className="text-orange-500" /></div>
                                <div>
                                    <p className="text-sm text-slate-400">{t('admin.resources.docs')}</p>
                                    <p className="text-xl font-bold">{contentBreakdown.document}</p>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="control">
                        {/* Configuração da chave OpenAI removida por segurança. Toda autenticação é feita apenas no backend. */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-slate-900 border-slate-800 hover:border-purple-500 transition-colors cursor-pointer" onClick={() => navigate('/admin/content-editor')}>
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">{t('dashboard.header.contentEditor')}</h3>
                                    <p className="text-sm text-slate-400">Acesso ao editor legado de conteúdo.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-colors cursor-pointer" onClick={() => navigate('/admin/seed-users')}>
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                                        <Users className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg">Administração de Testes</h3>
                                    <p className="text-sm text-slate-400">Seed de Usuários e Matérias.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                </Tabs>
            </main>
        </div>
    );
};

export default AdminDashboard;