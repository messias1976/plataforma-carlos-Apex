import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/MockAuthContext';

// Replace with your actual Stripe Publishable Key or keep as is for testing
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample_key_12345');

const StripeContext = createContext();

export const useStripe = () => useContext(StripeContext);

export const StripeProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const PLAN_CONFIG = {
    standard: {
      priceId: 'price_standard',
      name: 'Standard',
      price: 35.66,
      plan_type: 'standard'
    },
    premium: {
      priceId: 'price_premium',
      name: 'Premium',
      price: 65.90,
      plan_type: 'premium'
    }
  };

  const createCheckoutSession = async (planId) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe.",
        variant: "destructive",
      });
      return;
    }

    const planConfig = PLAN_CONFIG[planId];
    if (!planConfig) return;

    setLoading(true);

    try {
      // Mock Checkout Process
      setTimeout(() => {
        toast({
          title: "Redirecting to Stripe...",
          description: "(Mock) Checkout session created for " + planConfig.name,
          className: "bg-purple-600 text-white"
        });
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoading(false);
    }
  };

  return (
    <StripeContext.Provider value={{ createCheckoutSession, loading, PLAN_CONFIG }}>
      {children}
    </StripeContext.Provider>
  );
};