import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import api from '@/lib/api';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.id || user?.user_id || null;

  const fetchSubscription = useCallback(async () => {
    console.log('useSubscription: Starting fetch, user:', userId || 'null');
    setLoading(true);

    if (!userId) {
      console.log('useSubscription: No user, setting loading false');
      setLoading(false);
      setSubscription(null);
      return;
    }

    console.log('useSubscription: Fetching subscription for user:', userId);
    try {
      const response = await api.subscriptions.getByUserId(userId);
      const subscriptionData = response?.data ?? null;
      console.log('useSubscription: Fetched subscription:', subscriptionData);
      setSubscription(subscriptionData);
    } catch (err) {
      console.error("Error in useSubscription:", err);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log('useSubscription: useEffect triggered, user changed:', userId || 'null');
    fetchSubscription();

    const timeout = setTimeout(() => {
      console.log('useSubscription: Timeout reached, forcing loading false');
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [fetchSubscription, userId]);

  // Derived state
  const planType = subscription?.plan_type?.trim().toLowerCase() || 'free';
  const isActive = subscription?.status === 'active';
  const isPremium = planType === 'premium';

  // Feature access logic moved here for consistency
  const checkAccess = (feature) => {
    if (isPremium) return true; // Premium gets everything

    const accessRules = {
      free: {
        theoretical: false,
        studyZone: false,
        ranking: false,
        '1x1': false,
        battle_mode: false,
        ai: false,
        analytics: false,
        escape_room: false
      },
      standard: {
        theoretical: true, // Standard usually gets exams
        studyZone: true,
        ranking: false,
        '1x1': false,
        battle_mode: false,
        ai: true, // Basic AI
        analytics: false,
        escape_room: false
      }
    };

    // If plan not found in rules, default to free
    const rules = accessRules[planType] || accessRules.free;

    // Return true if the feature is enabled in the rules
    const allowed = !!rules[feature];
    console.log(`checkAccess [${feature}]:`, { planType, isPremium, allowed, rules });
    return allowed;
  };

  return {
    subscription,
    loading,
    planType,
    isActive,
    isPremium,
    hasAccess: checkAccess,
    refreshSubscription: fetchSubscription
  };
};