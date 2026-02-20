import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/MockAuthContext';

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const activateSubscription = async (planType) => {
    if (!user) {
      setError("Usuário não autenticado. Por favor, faça login.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get plan ID from backend
      const allPlans = await api.subscriptions.getAll();
      const plan = allPlans.find(p => p.name?.toLowerCase() === planType.toLowerCase());

      if (!plan) {
        throw new Error(`Plano ${planType} não encontrado no sistema.`);
      }

      // Create subscription for user
      const subscriptionData = {
        user_id: user.id,
        plan_id: plan.id,
        status: 'active',
        start_date: new Date().toISOString().split('T')[0]
      };

      await api.subscriptions.create(subscriptionData);

      setSuccess(true);
    } catch (err) {
      console.error('Error activating subscription:', err);
      setError(err.message || 'Falha ao ativar o plano.');
    } finally {
      setLoading(false);
    }
  };

  return {
    activateSubscription,
    loading,
    error,
    success
  };
};