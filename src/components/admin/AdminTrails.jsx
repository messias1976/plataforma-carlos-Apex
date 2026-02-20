import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const AdminTrails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Mock Trail 1</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Mock Trail 2</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminTrails;