import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implementar lógica de recuperação de senha via backend
            // Por enquanto, simulamos o envio do email
            await new Promise(resolve => setTimeout(resolve, 2000));

            setEmailSent(true);
            toast({
                title: "Email enviado!",
                description: "Verifique sua caixa de entrada.",
                className: "bg-green-600 text-white"
            });

        } catch (error) {
            console.error("Erro ao enviar email:", error);
            toast({
                title: "Erro",
                description: "Não foi possível enviar o email. Tente novamente.",
                variant: "destructive"
            });
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
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                {emailSent ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                ) : (
                                    <Mail className="w-6 h-6 text-purple-400" />
                                )}
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center text-white">
                            {emailSent ? "Email Enviado!" : "Esqueceu a senha?"}
                        </CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            {emailSent
                                ? "Verifique sua caixa de entrada para redefinir sua senha."
                                : "Digite seu email e enviaremos um link para redefinir sua senha."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {emailSent ? (
                            <div className="space-y-4">
                                <Alert className="border-green-500/50 bg-green-500/10">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <AlertDescription className="text-slate-300">
                                        Um email foi enviado para <strong className="text-white">{email}</strong> com instruções para redefinir sua senha.
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-2">
                                    <p className="text-sm text-slate-400 text-center">
                                        Não recebeu o email?
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                                        onClick={() => {
                                            setEmailSent(false);
                                            setEmail('');
                                        }}
                                    >
                                        Tentar novamente
                                    </Button>
                                </div>

                                <div className="text-center pt-2">
                                    <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
                                        Voltar para o login
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500"
                                    />
                                </div>

                                <Alert className="border-blue-500/50 bg-blue-500/10">
                                    <AlertDescription className="text-slate-300 text-sm">
                                        <strong>Nota:</strong> Esta funcionalidade está em desenvolvimento. Em produção, um email real será enviado para sua caixa de entrada.
                                    </AlertDescription>
                                </Alert>

                                <Button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Enviar Link de Recuperação
                                        </>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-slate-400 pt-2">
                                    Lembrou a senha?{' '}
                                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                                        Fazer login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
