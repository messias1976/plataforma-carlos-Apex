
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import TeacherInterface from './TeacherInterface';

const TeacherCard = () => {
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);

  return (
    <>
      <Card className="h-full bg-slate-900/50 border-slate-800 backdrop-blur hover:border-green-500/50 transition-all hover:shadow-2xl hover:shadow-green-900/10 group rounded-xl overflow-hidden flex flex-col cursor-pointer" onClick={() => setIsInterfaceOpen(true)}>
         <CardHeader className="pb-3 bg-slate-950/30">
              <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                          <MessageCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5">
                          <Sparkles className="w-3 h-3 mr-1" /> IA Ativa
                      </Badge>
              </div>
              <CardTitle className="text-xl text-white">Professor</CardTitle>
              <CardDescription className="text-slate-400">
                  Personalize suas aulas com IA
              </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 pt-2">
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
               Tenha aulas particulares instantâneas. Tire dúvidas no chat e receba explicações detalhadas.
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0 mt-auto">
             <Button 
                onClick={(e) => { e.stopPropagation(); setIsInterfaceOpen(true); }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all group-hover:bg-green-600 group-hover:border-green-500 group-hover:text-white"
             >
                Abrir <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
          </CardFooter>
      </Card>

      <TeacherInterface 
        isOpen={isInterfaceOpen} 
        onClose={() => setIsInterfaceOpen(false)} 
      />
    </>
  );
};

export default TeacherCard;
