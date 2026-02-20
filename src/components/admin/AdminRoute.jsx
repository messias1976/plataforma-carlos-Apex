
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/MockAuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-sm">Verificando permissões...</p>
      </div>
    );
  }

  // If not authenticated, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but NOT admin, redirect to Dashboard
  if (!isAdmin) {
    // We can't easily toast here during render, but the user will just be redirected.
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
