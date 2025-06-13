
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
// import { useLogo } from '../contexts/LogoContext'; // Removed
import { 
  SunIcon, MoonIcon, SparklesIcon, CheckCircleIcon, NotificationBellIcon, SettingsIcon, TrophyAwardIcon, FolderIcon
  // UploadIcon, TrashIcon // Removed as they were only for logo upload
} from '../components/Icons';
import { APP_NAME, DEFAULT_LOGO_SVG_STRING } from '../constants'; // DEFAULT_LOGO_SVG_STRING might not be needed here anymore
import { SubscriptionTier, NotificationPreferences } from '../types';
import { getNotificationPreferences, saveNotificationPreferences } from '../services/notificationService';
import { View } from '../components/BottomNavbar'; 


interface SettingsViewProps {
  onOpenSubscriptionModal: () => void;
  onNavigateToView: (view: View) => void; 
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenSubscriptionModal, onNavigateToView }) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { isSubscribed, tier } = useSubscription();
  // const { customLogoUrl, defaultLogoSvgString, setCustomLogo } = useLogo(); // Removed useLogo
  
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(getNotificationPreferences());
  // const [logoUploadError, setLogoUploadError] = useState<string | null>(null); // Removed
  // const fileInputRef = useRef<HTMLInputElement>(null); // Removed


  useEffect(() => {
    saveNotificationPreferences(notificationPrefs);
  }, [notificationPrefs]);

  const handleNotificationPrefChange = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
  };
  
  const handleMasterToggleChange = (value: boolean) => {
    const newPrefs = { ...notificationPrefs, allEnabled: value };
    setNotificationPrefs(newPrefs);
  };

  // Removed handleLogoUpload function
  // Removed handleRemoveCustomLogo function


  const SettingItem: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; className?: string }> = 
    ({ title, children, icon, className }) => (
    <div className={`bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-gray-700/50 ${className}`}>
      <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3 flex items-center">
        {icon && <span className="mr-3 text-brand-orange">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );

  const ToggleSwitch: React.FC<{ id: string; checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string; disabled?: boolean; }> = 
    ({ id, checked, onChange, label, description, disabled = false }) => (
    <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-60' : ''}`}>
      <div>
        <label htmlFor={id} className={`font-medium text-text-light dark:text-text-dark ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>{label}</label>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`${checked && !disabled ? 'bg-brand-orange' : 'bg-gray-300 dark:bg-gray-600'} 
                    relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full 
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-brand-orange dark:focus:ring-offset-gray-800`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${checked && !disabled ? 'translate-x-5' : 'translate-x-0'} 
                      pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                      transition ease-in-out duration-200`}
        />
      </button>
    </div>
  );

  const appVersion = "1.1.0"; 

  return (
    <div className="space-y-6 pb-20 text-text-light dark:text-text-dark max-w-2xl mx-auto">
      <div className="text-center my-6">
        <SettingsIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-brand-orange dark:text-orange-400 mb-3" />
        <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">
          App Settings
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customize your {APP_NAME} experience.</p>
      </div>

      <SettingItem title="Appearance" icon={<SunIcon className="w-5 h-5" />}>
        <div className="flex items-center justify-between">
          <p className="text-sm">Theme</p>
          <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button 
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-500 text-brand-orange shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              aria-pressed={theme === 'light'}
            >
              <SunIcon className="w-5 h-5 inline mr-1" /> Light
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-gray-800 text-brand-orange shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              aria-pressed={theme === 'dark'}
            >
              <MoonIcon className="w-5 h-5 inline mr-1" /> Dark
            </button>
          </div>
        </div>
        {/* Custom App Logo section removed */}
      </SettingItem>

      <SettingItem title="Notifications" icon={<NotificationBellIcon className="w-5 h-5" />}>
        <ToggleSwitch
          id="allNotifications"
          checked={notificationPrefs.allEnabled}
          onChange={handleMasterToggleChange}
          label="Enable All Notifications (Browser Push)"
        />
        <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
        <ToggleSwitch
          id="dailyHotContent"
          checked={notificationPrefs.dailyHotContent}
          onChange={(val) => handleNotificationPrefChange('dailyHotContent', val)}
          label="Daily Hot Content"
          description="Get a quick daily alert with today's most trending or viral video."
          disabled={!notificationPrefs.allEnabled && !notificationPrefs.inAppShowContent} 
        />
        <ToggleSwitch
          id="weeklyTopList"
          checked={notificationPrefs.weeklyTopList}
          onChange={(val) => handleNotificationPrefChange('weeklyTopList', val)}
          label="Weekly Top Picks"
          description="Receive a weekly roundup of the best videos you might’ve missed."
          disabled={!notificationPrefs.allEnabled && !notificationPrefs.inAppShowContent}
        />
        <ToggleSwitch
          id="inactivityReengagement"
          checked={notificationPrefs.inactivityReengagement}
          onChange={(val) => handleNotificationPrefChange('inactivityReengagement', val)}
          label="We Miss You!"
          description="We’ll give you a friendly reminder if you haven’t visited in a while."
          disabled={!notificationPrefs.allEnabled && !notificationPrefs.inAppShowEngagement}
        />
         <ToggleSwitch
          id="humorousSurprising"
          checked={notificationPrefs.humorousSurprising}
          onChange={(val) => handleNotificationPrefChange('humorousSurprising', val)}
          label="Fun & Surprise Alerts"
          description="Occasional fun, unexpected or quirky video suggestions to make your day."
           disabled={!notificationPrefs.allEnabled && !notificationPrefs.inAppShowContent}
        />
        <ToggleSwitch
          id="gamificationNotifications"
          checked={notificationPrefs.gamification}
          onChange={(val) => handleNotificationPrefChange('gamification', val)}
          label="Badges & Streaks Alerts"
          description="Get notified about your achievements and viewing streaks."
          disabled={!notificationPrefs.allEnabled && !notificationPrefs.inAppShowEngagement}
        />
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-text-light dark:text-text-dark mb-1">In-App Notification Visibility:</p>
             <ToggleSwitch
              id="inAppSystem"
              checked={notificationPrefs.inAppShowSystem}
              onChange={(val) => handleNotificationPrefChange('inAppShowSystem', val)}
              label="System & Feature Updates"
              description="Show in-app messages about new features or app changes."
            />
             <ToggleSwitch
              id="inAppContent"
              checked={notificationPrefs.inAppShowContent}
              onChange={(val) => handleNotificationPrefChange('inAppShowContent', val)}
              label="New Content Alerts"
              description="Show in-app messages for daily/weekly picks, curated feeds."
            />
             <ToggleSwitch
              id="inAppEngagement"
              checked={notificationPrefs.inAppShowEngagement}
              onChange={(val) => handleNotificationPrefChange('inAppShowEngagement', val)}
              label="Engagement & Gamification"
              description="Show in-app messages for streaks, badges, reminders."
            />
        </div>
      </SettingItem>
      
      <SettingItem title="Account & Achievements" icon={<FolderIcon className="w-5 h-5" />}>
          {isSubscribed ? (
            <div className="flex items-center justify-between mb-4">
                <div>
                <p className="font-medium">{APP_NAME} Premium Active!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    You are on the {tier === SubscriptionTier.MONTHLY ? 'Monthly' : 'Yearly'} plan.
                </p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
            ) : (
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Unlock an ad-free experience and support {APP_NAME}.
                </p>
                <button
                onClick={onOpenSubscriptionModal}
                className="w-full bg-brand-orange text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center mb-4"
                >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Go Premium
                </button>
            </div>
            )}
          <button
            onClick={() => onNavigateToView('achievements')}
            className="w-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <TrophyAwardIcon className="w-5 h-5 mr-2" />
            View Achievements
          </button>
      </SettingItem>

      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
        <p>{APP_NAME} Version {appVersion}</p>
      </div>
    </div>
  );
};