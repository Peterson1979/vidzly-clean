
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { SubscriptionTier } from '../types';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  isSubscribed: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<SubscriptionTier>(SubscriptionTier.NONE);
  
  const isSubscribed = useMemo(() => tier !== SubscriptionTier.NONE, [tier]);

  const contextValue = useMemo(() => ({
    tier,
    setTier,
    isSubscribed
  }), [tier, isSubscribed]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};