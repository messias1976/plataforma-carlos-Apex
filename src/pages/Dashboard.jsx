
import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/MockAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/dashboard/Header';
import StudentProfile from '@/components/dashboard/StudentProfile';
import Store from '@/components/dashboard/Store';
import Ranking from '@/components/dashboard/Ranking';
import StudyZoneRedesigned from '@/components/dashboard/StudyZoneRedesigned';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, User, BarChart, Key, Smartphone, Trophy, ShoppingBag, CreditCard, Map, BookOpen, ArrowRight, Sword } from 'lucide-react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import FloatingReclameAqui from '@/components/common/FloatingReclameAqui';
import ProtectedFeature from '@/components/subscription/ProtectedFeature';
import { fadeIn, scaleIn } from '@/constants/animations';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';

// Import Cards directly
import TeacherCard from '@/components/landing/TeacherCard';
import TheoreticalExamsCard from '@/components/landing/TheoreticalExamsCard';
import CustomStudyArea from '@/components/dashboard/CustomStudyArea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Lazy Load Heavy Components
const Analytics = React.lazy(() => import('@/components/dashboard/Analytics'));
const EscapeRoom = React.lazy(() => import('@/components/dashboard/EscapeRoom'));
const SwipeLearning = React.lazy(() => import('@/components/dashboard/SwipeLearning'));
const BattleMode = React.lazy(() => import('@/components/dashboard/BattleMode'));

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-neon-500">{t('common.loading')}</div>;
  }

  if (!user) return null;

  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-[400px] w-full bg-slate-900/20 rounded-2xl border border-slate-800 border-dashed">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-neon-500/30 border-t-neon-500 rounded-full animate-spin"></div>
        <span className="text-slate-500 text-sm">{t('common.loading')}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-900/20 via-slate-950 to-slate-950 pb-12">
      <Helmet>
        <title>Dashboard - APEX</title>
      </Helmet>
      <Toaster />

      <Header />

      <main className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="col-span-12 space-y-6">
            <Tabs defaultValue="trails" className="w-full">
              <TabsList className="flex flex-wrap bg-slate-900/50 border border-neon-500/20 h-auto p-2 gap-1 mb-6 rounded-2xl">
                <TabsTrigger value="trails" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <Map className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.home')}</span>
                </TabsTrigger>

                <TabsTrigger value="zone" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <GraduationCap className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.zone')}</span>
                </TabsTrigger>

                <TabsTrigger value="profile" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <User className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.profile')}</span>
                </TabsTrigger>

                <TabsTrigger value="ranking" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <Trophy className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.ranking')}</span>
                </TabsTrigger>

                <TabsTrigger value="store" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <ShoppingBag className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.store')}</span>
                </TabsTrigger>

                <TabsTrigger value="analytics" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <BarChart className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.analytics')}</span>
                </TabsTrigger>

                <TabsTrigger value="escape" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <Key className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.escape')}</span>
                </TabsTrigger>

                <TabsTrigger value="battle" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <Sword className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Batalha</span>
                </TabsTrigger>

                <TabsTrigger value="swipe" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <Smartphone className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.swipe')}</span>
                </TabsTrigger>

                <TabsTrigger value="subscription" className="flex-1 min-w-[80px] data-[state=active]:bg-neon-500 data-[state=active]:text-slate-950 text-xs sm:text-sm rounded-xl">
                  <CreditCard className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('dashboard.tabs.subscription')}</span>
                </TabsTrigger>
              </TabsList>

              {/* Content Sections */}
              <TabsContent value="trails" className="space-y-6">
                <motion.div variants={fadeIn} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <TeacherCard />
                  <TheoreticalExamsCard />
                  <CustomStudyArea />

                  {/* Tutorial Card */}
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur hover:border-orange-500/50 transition-all rounded-xl overflow-hidden group h-full flex flex-col">
                    <CardHeader className="pb-3 bg-slate-950/30">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                          <BookOpen className="w-6 h-6 text-orange-500" />
                        </div>
                      </div>
                      <CardTitle className="text-xl text-white">Como Usar o Aplicativo</CardTitle>
                      <CardDescription className="text-slate-400 text-sm">Guia interativo passo a passo</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 pt-2">
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Aprenda a utilizar todas as funcionalidades do APEX para maximizar seu aprendizado.
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 mt-auto">
                      <Button
                        onClick={() => navigate('/tutorial')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 transition-all hover:text-white"
                      >
                        Abrir <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="zone" className="space-y-6">
                <motion.div variants={fadeIn} initial="initial" animate="animate">
                  <StudyZoneRedesigned />
                </motion.div>
              </TabsContent>

              <TabsContent value="profile">
                <motion.div variants={scaleIn} initial="initial" animate="animate">
                  <StudentProfile />
                </motion.div>
              </TabsContent>

              <TabsContent value="ranking">
                <ProtectedFeature feature="ranking">
                  <motion.div variants={scaleIn} initial="initial" animate="animate">
                    <Ranking />
                  </motion.div>
                </ProtectedFeature>
              </TabsContent>

              <TabsContent value="store">
                <motion.div variants={scaleIn} initial="initial" animate="animate">
                  <Store />
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics">
                <ProtectedFeature feature="analytics">
                  <motion.div variants={scaleIn} initial="initial" animate="animate">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <Analytics />
                      </Suspense>
                    </ErrorBoundary>
                  </motion.div>
                </ProtectedFeature>
              </TabsContent>

              <TabsContent value="escape">
                <ProtectedFeature feature="escape_room">
                  <motion.div variants={scaleIn} initial="initial" animate="animate">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <EscapeRoom />
                      </Suspense>
                    </ErrorBoundary>
                  </motion.div>
                </ProtectedFeature>
              </TabsContent>

              <TabsContent value="battle">
                <ProtectedFeature feature="battle_mode">
                  <motion.div variants={scaleIn} initial="initial" animate="animate">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingFallback />}>
                        <BattleMode />
                      </Suspense>
                    </ErrorBoundary>
                  </motion.div>
                </ProtectedFeature>
              </TabsContent>

              <TabsContent value="swipe">
                <motion.div variants={scaleIn} initial="initial" animate="animate">
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <SwipeLearning />
                    </Suspense>
                  </ErrorBoundary>
                </motion.div>
              </TabsContent>

              <TabsContent value="subscription">
                <motion.div variants={scaleIn} initial="initial" animate="animate">
                  <SubscriptionManager />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <FloatingReclameAqui />
    </div>
  );
};

export default Dashboard;
