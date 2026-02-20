import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();
    const { toast } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        // Validações
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            setIsLoading(false);
            return;
        }

        if (!formData.fullName.trim()) {
            setError('Por favor, informe seu nome completo.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await register(formData.email, formData.password, formData.fullName);

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
                return;
            }

            toast({
                title: "Conta criada com sucesso!",
                description: "Você será redirecionado para o dashboard.",
                className: "bg-green-600 text-white"
            });

            // Redirecionar para dashboard após registro bem-sucedido
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (e) {
            console.error("Erro ao criar conta:", e);
            setError(e.message || "Ocorreu um erro ao criar sua conta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="w-full max-w-md">
                <Link
                    to="/login"
                    className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Login
                </Link>

                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center text-white">Criar Conta</CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            Preencha os dados abaixo para começar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-200">Nome Completo</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">Senha</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-200">Confirmar Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Digite a senha novamente"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50">
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Criando conta...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Criar Conta
                                    </>
                                )}
                            </Button>

                            <div className="text-center text-sm text-slate-400 pt-2">
                                Já tem uma conta?{' '}
                                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                                    Fazer login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
