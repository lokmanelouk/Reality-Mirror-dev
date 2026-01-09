
import React, { useState, useEffect, useCallback } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { TitleBar } from './components/TitleBar';
import { UserSettings, ActivityRecord } from './types';
import { STORAGE_KEY, ACTIVITY_KEY } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    const savedActivity = localStorage.getItem(ACTIVITY_KEY);

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    if (savedActivity) {
      setActivities(JSON.parse(savedActivity));
    }
    setIsInitialized(true);
  }, []);

  const handleOnboardingComplete = (newSettings: UserSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to erase your mission?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
      setSettings(null);
      setActivities([]);
    }
  };

  const logActivity = useCallback((record: ActivityRecord) => {
    setActivities(prev => {
      const updated = [...prev, record];
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  if (!isInitialized) return <div className="bg-black min-h-screen"></div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 flex flex-col overflow-hidden">
      {/* Custom Title Bar for Desktop Experience */}
      <TitleBar />

      <div className="flex-1 relative overflow-hidden">
        {!settings || !settings.isOnboarded ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Dashboard 
            settings={settings} 
            activities={activities} 
            onReset={handleReset}
            onLogActivity={logActivity}
          />
        )}
      </div>
      
      {/* Decorative Mirror Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[200]"></div>
    </div>
  );
};

export default App;
