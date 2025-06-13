
import React from 'react';
import { SubscriptionTier } from '../types';
import { useSubscription } from '../contexts/SubscriptionContext';
import { XIcon, CheckCircleIcon, SparklesIcon } from './Icons';
import { APP_NAME } from '../constants'; // Import APP_NAME

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { setTier, tier } = useSubscription();

  if (!isOpen) return null;

  const handleSelectTier = (selectedTier: SubscriptionTier) => {
    setTier(selectedTier);
    alert(`You've selected the ${selectedTier} subscription! Thank you for subscribing.`); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-70 p-4"> 
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg relative text-text-light dark:text-text-dark">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Close subscription modal"
        >
          <XIcon className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-6">
          <SparklesIcon className="h-12 w-12 text-brand-orange mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-white">Go Ad-Free with {APP_NAME} Premium!</h2> 
          <p className="text-gray-600 dark:text-gray-400 mt-2">Enjoy uninterrupted video streaming.</p>
        </div>

        <div className="space-y-4">
          <SubscriptionOption
            title="Monthly Plan"
            price="$4.99/month"
            features={['Ad-free viewing']}
            onSelect={() => handleSelectTier(SubscriptionTier.MONTHLY)}
            isSelected={tier === SubscriptionTier.MONTHLY}
          />
          <SubscriptionOption
            title="Yearly Plan"
            price="$49.99/year"
            features={['Best Value (Save 20%)', 'Ad-free viewing']}
            onSelect={() => handleSelectTier(SubscriptionTier.YEARLY)}
            isSelected={tier === SubscriptionTier.YEARLY}
            isPopular
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-6 text-center">
          Subscriptions auto-renew. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

interface SubscriptionOptionProps {
  title: string;
  price: string;
  features: string[];
  onSelect: () => void;
  isSelected: boolean;
  isPopular?: boolean;
}

const SubscriptionOption: React.FC<SubscriptionOptionProps> = ({ title, price, features, onSelect, isSelected, isPopular }) => (
  <div 
    className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative
                ${isSelected ? 'border-brand-orange bg-gray-50 dark:bg-gray-700 scale-102' : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
    onClick={onSelect}
  >
    {isPopular && !isSelected && (
        <div className="absolute -top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
            POPULAR
        </div>
    )}
    <div className="flex justify-between items-center mb-3">
      <h3 className={`text-xl font-semibold ${isSelected ? 'text-brand-orange' : 'text-text-light dark:text-white'}`}>{title}</h3>
      <p className={`text-lg font-bold ${isSelected ? 'text-brand-orange' : 'text-text-light dark:text-white'}`}>{price}</p>
    </div>
    <ul className="space-y-1.5 text-sm">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
          <CheckCircleIcon className={`h-5 w-5 mr-2 ${isSelected ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
          {feature}
        </li>
      ))}
    </ul>
    {isSelected && (
        <div className="absolute top-3 right-3 text-green-500 dark:text-green-400">
             <CheckCircleIcon className="h-6 w-6" />
        </div>
    )}
  </div>
);