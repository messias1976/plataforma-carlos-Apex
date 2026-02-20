import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider = ({ children }) => {
  // Use the hook as the source of truth for the context
  const { 
    subscription, 
    loading, 
    planType, 
    isActive, 
    isPremium, 
    hasAccess, 
    refreshSubscription 
  } = useSubscription();

  // Debug logging
  useEffect(() => {
    if (!loading) {
      console.log('PlanContext Initialized:', {
        planType,
        isPremium,
        isActive,
        rawSubscription: subscription
      });
    }
  }, [loading, planType, isPremium, isActive, subscription]);

  const value = {
    subscription,
    loading,
    planType,
    isActive,
    isPremium,
    hasAccess,
    refreshSubscription,
    // Helper to manually set plan (mostly for dev/testing or immediate UI updates before DB sync)
    selectPlan: async (newPlan) => {
        console.warn("selectPlan is deprecated in favor of DB sync, but retained for compatibility.");
        await refreshSubscription(); 
    }
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};