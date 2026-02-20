import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, Database, Shield, RefreshCw, Book } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const AdminSeedUsers = () => {
    const [loading, setLoading] = useState(false);
    const [seedingSubjects, setSeedingSubjects] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const { toast } = useToast();

    const handleSeedUsers = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const testUsers = [
                { email: 'aluno1@apex.com', password: 'Teste@123456', full_name: 'Aluno Teste 1' },
                { email: 'aluno2@apex.com', password: 'Teste@123456', full_name: 'Aluno Teste 2' },
            ];

            const response = await api.auth.registerBulk(testUsers);
            const createdUsers = response.results;

            setResults(createdUsers);
            toast({
                title: "Usuários Criados",
                description: `${createdUsers.filter(u => u.status === 'sucesso').length} usuário(s) criado(s)`,
                className: "bg-green-600 text-white"
            });
        } catch (err) {
            console.error('Seeding error:', err);
            setError(err.message || 'Falha ao criar usuários de teste.');
            toast({
                title: "Erro",
                description: err.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSeedSubjects = async () => {
        setSeedingSubjects(true);
        try {
            // Define Portuguese Structure
            const areas = {
                'linguagens': ['Português', 'Literatura', 'Artes', 'Inglês', 'Espanhol'],
                'matematica': ['Matemática Básica', 'Álgebra', 'Geometria', 'Estatística'],
                'natureza': ['Biologia', 'Física', 'Química'],
                'humanas': ['História', 'Geografia', 'Filosofia', 'Sociologia']
            };

            const defaultTopics = ['Introdução', 'Conceitos Fundamentais', 'Aprofundamento', 'Exercícios'];

            // 1. Clear existing (Optional - be careful in prod, but ok for dev seed tool)
            // Note: Due to FK constraints, deleting subjects requires deleting topics/content first.
            // For safety, we will just upsert or add new ones to avoid breaking existing relations blindly.
            // Or if we want a clean slate:
            /* 
            await supabase.from('topic_content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('topics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            await supabase.from('subjects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            */

            let addedCount = 0;

            for (const [areaKey, subjectsList] of Object.entries(areas)) {
                for (const subjectName of subjectsList) {
                    // Check if exists
                    const allSubjects = await api.subjects.getAll();
                    const existing = allSubjects.find(s => s.name === subjectName);

                    let subjectId = existing?.id;

                    if (!subjectId) {
                        const newSub = await api.subjects.create({
                            name: subjectName,
                            area: areaKey,
                            description: `Matéria de ${subjectName} da área de ${areaKey}.`
                        });
                        subjectId = newSub.id;
                        addedCount++;
                    } else {
                        // Update area if missing
                        await api.subjects.update(subjectId, { area: areaKey });
                    }

                    // Add default topics if none exist
                    const topics = await api.topics.getAll(subjectId);

                    if (topics.length === 0) {
                        for (let idx = 0; idx < defaultTopics.length; idx++) {
                            await api.topics.create({
                                subject_id: subjectId,
                                title: defaultTopics[idx],
                                order_index: idx + 1,
                                description: `Tópico de ${defaultTopics[idx]}`
                            });
                        }
                    }
                }
            }

            toast({
                title: "Seed Concluído",
                description: `Estrutura de matérias em Português atualizada/criada com sucesso.`,
                className: "bg-green-600 text-white"
            });

        } catch (err) {
            console.error("Subject Seed Error", err);
            toast({
                variant: "destructive",
                title: "Erro no Seed",
                description: err.message
            });
        } finally {
            setSeedingSubjects(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12">
            <Helmet>
                <title>Admin - Seed Data | APEX</title>
            </Helmet>

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-8 h-8 text-neon-500" />
                    <h1 className="text-3xl font-bold text-white">Administração de Testes e Dados</h1>
                </div>

                <div className="grid gap-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-neon-400" />
                                Usuários de Teste
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Resetar e recriar contas de teste (alunoteste2, alunoteste3).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Button
                                onClick={handleSeedUsers}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Resetar Usuários'}
                            </Button>

                            {results && (
                                <Alert className="bg-green-900/20 border-green-900/50 text-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <AlertTitle>Sucesso!</AlertTitle>
                                    <AlertDescription>Usuários recriados.</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Book className="w-5 h-5 text-orange-400" />
                                Estrutura de Matérias (PT-BR)
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Popular banco de dados com matérias (Linguagens, Matemática, etc.) em Português.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleSeedSubjects}
                                disabled={seedingSubjects}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                            >
                                {seedingSubjects ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Popular Matérias (PT-BR)'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminSeedUsers;