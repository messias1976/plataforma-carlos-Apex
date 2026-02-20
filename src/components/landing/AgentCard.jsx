import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AgentCard = () => {
  const { toast } = useToast();

  const handleClick = (e) => {
    e.stopPropagation();
    toast({
      title: "Em breve",
      description: "🚧 O Agente IA estará disponível na próxima atualização! 🚀",
      variant: "default",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border-slate-800 hover:border-indigo-500/50 transition-all rounded-xl overflow-hidden shadow-lg group cursor-pointer" onClick={handleClick}>
        <CardHeader>
            <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5">
                    Assistente 24/7
                </Badge>
            </div>
            <CardTitle className="text-xl text-white">Agente</CardTitle>
            <CardDescription className="text-slate-400">Seu assistente pessoal de aprendizado</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <p className="text-slate-300 text-sm leading-relaxed">
                O Agente APEX é um mentor virtual inteligente que acompanha seu progresso em tempo real, adapta o currículo e sugere revisões estratégicas.
            </p>
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-200 italic">
                    "Identifiquei que você precisa reforçar conceitos de Física Quântica. Vamos revisar?"
                </p>
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
             <Button 
                onClick={handleClick}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white"
             >
                Abrir <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
        </CardFooter>
    </Card>
  );
};

export default AgentCard;