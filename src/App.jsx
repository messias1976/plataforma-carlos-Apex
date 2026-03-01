import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminSeedUsers from '@/pages/AdminSeedUsers';
import AdminContentEditor from '@/pages/AdminContentEditor';
import TheoreticalExamsPage from '@/pages/TheoreticalExamsPage';
import PlanSelectionPage from '@/pages/PlanSelectionPage';
import TutorialPage from '@/pages/TutorialPage';
import SubjectContentPage from '@/pages/SubjectContentPage';
import TopicContentViewer from '@/components/dashboard/TopicContentViewer';
import StripePaymentSuccess from '@/pages/StripePaymentSuccess';
import StripePaymentCancel from '@/pages/StripePaymentCancel';
import DebugPlanPage from '@/pages/DebugPlanPage';
import AdminRoute from '@/components/admin/AdminRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/MockAuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PlanProvider } from '@/contexts/PlanContext';
import { StripeProvider } from '@/contexts/StripeContext';
import { TrailsProvider } from '@/contexts/TrailsContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedPlanRoute from '@/components/subscription/ProtectedPlanRoute';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* AuthProvider must be the top-most provider for auth-dependent contexts */}
            <AuthProvider>
                <TrailsProvider>
                    <LanguageProvider>
                        <PlanProvider>
                            <StripeProvider>
                                <AdminProvider>
                                    {/* HelmetProvider now correctly nested within AdminProvider */}
                                    <HelmetProvider>
                                        <Helmet>
                                            <title>APEX - AI Educational Platform</title>
                                            <meta name="description" content="APEX - The adaptive learning platform powered by Artificial Intelligence." />
                                        </Helmet>

                                        <Routes>
                                            {/* ROOT ROUTE: LANDING PAGE */}
                                            <Route path="/" element={<LandingPage />} />

                                            {/* PUBLIC ROUTES */}
                                            <Route path="/login" element={<LoginPage />} />
                                            <Route path="/register" element={<RegisterPage />} />
                                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                                            {/* PAYMENT ROUTES */}
                                            <Route path="/payment-success" element={<StripePaymentSuccess />} />
                                            <Route path="/payment-cancel" element={<StripePaymentCancel />} />

                                            <Route path="/plans" element={<PlanSelectionPage />} />

                                            {/* PROTECTED ROUTES */}
                                            <Route path="/dashboard" element={
                                                <ProtectedRoute>
                                                    <Dashboard />
                                                </ProtectedRoute>
                                            } />

                                            <Route path="/tutorial" element={
                                                <ProtectedRoute>
                                                    <TutorialPage />
                                                </ProtectedRoute>
                                            } />

                                            <Route path="/theoretical-exams" element={
                                                <ProtectedRoute>
                                                    <ProtectedPlanRoute feature="theoretical">
                                                        <TheoreticalExamsPage />
                                                    </ProtectedPlanRoute>
                                                </ProtectedRoute>
                                            } />

                                            <Route path="/study-zone" element={
                                                <ProtectedRoute>
                                                    <SubjectContentPage />
                                                </ProtectedRoute>
                                            } />

                                            <Route path="/topic/:topicId" element={
                                                <ProtectedRoute>
                                                    <TopicContentViewer />
                                                </ProtectedRoute>
                                            } />

                                            {/* ADMIN ROUTES */}
                                            <Route path="/admin" element={
                                                <AdminRoute>
                                                    <AdminDashboard />
                                                </AdminRoute>
                                            } />

                                            <Route path="/admin/seed-users" element={
                                                <AdminRoute>
                                                    <AdminSeedUsers />
                                                </AdminRoute>
                                            } />

                                            <Route path="/admin/content-editor" element={
                                                <AdminRoute>
                                                    <AdminContentEditor />
                                                </AdminRoute>
                                            } />

                                            {/* DEBUG ROUTES */}
                                            <Route path="/debug-plan" element={
                                                <ProtectedRoute>
                                                    <DebugPlanPage />
                                                </ProtectedRoute>
                                            } />

                                            {/* CATCH-ALL */}
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>

                                        <Toaster />
                                    </HelmetProvider>
                                </AdminProvider>
                            </StripeProvider>
                        </PlanProvider>
                    </LanguageProvider>
                </TrailsProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;