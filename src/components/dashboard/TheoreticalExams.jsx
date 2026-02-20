import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const TheoreticalExams = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-slate-900/60 border-neon-500/20">
          <CardHeader>
            <FileText className="w-8 h-8 text-neon-500 mb-2" />
            <CardTitle className="text-white">Exam #{i}</CardTitle>
            <CardDescription className="text-slate-400">Mock Exam Description</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-neon-600 hover:bg-neon-500">Start Mock Exam</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TheoreticalExams;