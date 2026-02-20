import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/MockAuthContext';
import { BookOpen, Calculator, Atom, Brain } from 'lucide-react';

const StudyZone = () => {
  const { user } = useAuth();

  const areas = [
    { title: 'Linguagens', icon: BookOpen, color: 'text-blue-400' },
    { title: 'Matemática', icon: Calculator, color: 'text-purple-400' },
    { title: 'Natureza', icon: Atom, color: 'text-green-400' },
    { title: 'Humanas', icon: Brain, color: 'text-orange-400' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {areas.map((area, idx) => (
        <Card key={idx} className="bg-slate-900/60 border-slate-700">
          <CardHeader className="flex flex-row items-center gap-4">
            <area.icon className={`w-8 h-8 ${area.color}`} />
            <CardTitle className="text-white">{area.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">Explore contents related to {area.title}. (Mock Data)</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudyZone;