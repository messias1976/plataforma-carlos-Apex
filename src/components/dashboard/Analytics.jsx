import React from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  const { user } = useAuth();

  // Mock data for graphs (would come from user.stats.dailyStudyTime in real app)
  const studyData = [
    { name: 'Mon', minutes: 45 },
    { name: 'Tue', minutes: 30 },
    { name: 'Wed', minutes: 60 },
    { name: 'Thu', minutes: 25 },
    { name: 'Fri', minutes: 90 },
    { name: 'Sat', minutes: 45 },
    { name: 'Sun', minutes: 0 },
  ];

  const subjectData = Object.entries(user?.subjectProgress || {}).map(([name, value]) => ({ name, value }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Time Evolution */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white">Study Time (Minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#10b981" fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Performance */}
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white">Quiz Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[250px]">
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-400 mb-2">
                  {user?.stats?.quizCorrect + user?.stats?.quizIncorrect > 0
                    ? Math.round((user.stats.quizCorrect / (user.stats.quizCorrect + user.stats.quizIncorrect)) * 100)
                    : 0}%
                </div>
                <p className="text-slate-400">Correct Answers</p>
                <div className="flex gap-4 mt-6">
                  <div className="bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-500/20">
                    <span className="block text-xl font-bold text-emerald-400">{user?.stats?.quizCorrect || 0}</span>
                    <span className="text-xs text-slate-500">Correct</span>
                  </div>
                  <div className="bg-red-900/30 px-4 py-2 rounded-lg border border-red-500/20">
                    <span className="block text-xl font-bold text-red-400">{user?.stats?.quizIncorrect || 0}</span>
                    <span className="text-xs text-slate-500">Incorrect</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white">Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;