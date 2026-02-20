import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Book, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

const SubjectSelector = ({ selectedSubjectId, onSelectSubject }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await api.subjects.getAll();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: t('common.error'),
        description: "Failed to load subjects.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-neon-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      {subjects.map((subject) => {
        const isSelected = selectedSubjectId === subject.id;
        return (
          <Card
            key={subject.id}
            className={`cursor-pointer transition-all hover:scale-105 ${isSelected
                ? 'bg-neon-600/20 border-neon-500 shadow-[0_0_15px_rgba(15,255,80,0.2)]'
                : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            onClick={() => onSelectSubject(subject.id)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[100px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-neon-500 text-slate-900' : 'bg-slate-800 text-slate-400'
                }`}>
                {isSelected ? <Check className="w-5 h-5" /> : <Book className="w-4 h-4" />}
              </div>
              <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {subject.name}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubjectSelector;