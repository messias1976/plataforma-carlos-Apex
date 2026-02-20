
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowRight } from 'lucide-react';
import TheoreticalExamsInterface from './TheoreticalExamsInterface';

const TheoreticalExamsCard = () => {
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);

  return (
    <>
      <Card className="h-full bg-slate-900/50 border-slate-800 backdrop-blur hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/10 group rounded-xl overflow-hidden flex flex-col cursor-pointer" onClick={() => setIsInterfaceOpen(true)}>
        <CardHeader className="pb-3 bg-slate-950/30">
            <div className="flex justify-between items-start mb-2">
                    <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5">
                    IA Generator
                    </Badge>
            </div>
            <CardTitle className="text-xl text-white">Provas Teóricas</CardTitle>
            <CardDescription className="text-slate-400 text-sm">Avaliação automática</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-2">
            <p className="text-sm text-slate-400 leading-relaxed">
                Gere avaliações completas sobre qualquer tema em segundos para testar seus conhecimentos.
            </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
             <Button 
                onClick={(e) => { e.stopPropagation(); setIsInterfaceOpen(true); }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white"
             >
                Abrir <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
        </CardFooter>
      </Card>

      <TheoreticalExamsInterface
        isOpen={isInterfaceOpen}
        onClose={() => setIsInterfaceOpen(false)}
      />
    </>
  );
};

export default TheoreticalExamsCard;
