import React, { useState, useEffect } from 'react';
import { AppMode, ClockSettings, Language } from './types';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ExploreMode } from './components/ExploreMode';
import { SetClockGame } from './components/SetClockGame';
import { QuizMode } from './components/QuizMode';
import { DailyRoutineMode } from './components/DailyRoutineMode';
import { SplashScreen } from './components/SplashScreen';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('home');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('clock_lang');
    return (saved as Language) || 'ar';
  });

  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('clock_stars');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Time State for exploration
  const [hours, setHours] = useState<number>(4);
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);

  // Settings
  const [settings, setSettings] = useState<ClockSettings>({
    showMinuteNumbers: true,
    show24Hours: false,
    showFractionsOverlay: false,
    showHandNames: true,
    soundEnabled: true,
    isLiveTime: false,
  });

  // Splash Screen State
  const [isSplashOpen, setIsSplashOpen] = useState<boolean>(true);

  // Synchronize Live Clock if enabled
  useEffect(() => {
    if (!settings.isLiveTime) return;

    const syncWithSystem = () => {
      const now = new Date();
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    };

    syncWithSystem();
    const interval = setInterval(syncWithSystem, 1000);
    return () => clearInterval(interval);
  }, [settings.isLiveTime]);

  const handleEarnStar = () => {
    setStarsCount((prev) => {
      const updated = prev + 1;
      localStorage.setItem('clock_stars', updated.toString());
      return updated;
    });
  };

  const handleUpdateSettings = (newPartial: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleToggleSound = () => {
    const newSoundState = !settings.soundEnabled;
    sounds.enabled = newSoundState;
    setSettings((prev) => ({ ...prev, soundEnabled: newSoundState }));
  };

  const handleToggleLang = () => {
    const newLang: Language = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('clock_lang', newLang);
    if (newLang === 'en') {
      sounds.speakEnglish('Language switched to English.');
    } else {
      sounds.speakArabic('تَمَّ التَّحْوِيلُ إِلَى اللُّغَةِ الْعَرَبِيَّةِ.');
    }
  };

  const handleCloseSplash = () => {
    setIsSplashOpen(false);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-amber-50/40 text-slate-800 flex flex-col ${
        lang === 'ar' ? "font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]" : "font-sans"
      } text-base`}
    >
      {/* Modern UI Splash / Welcome Screen - Runs first before educational activities */}
      <SplashScreen
        isOpen={isSplashOpen}
        onClose={handleCloseSplash}
        lang={lang}
      />

      {/* Main Educational Application Content - Hidden until splash finishes */}
      <div
        className={`flex-1 flex flex-col transition-opacity duration-500 ${
          isSplashOpen ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'
        }`}
      >
        {/* Top Header with Back to Home button inside activities */}
        <Header
          currentMode={currentMode}
          onBackToHome={() => setCurrentMode('home')}
          starsCount={starsCount}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          lang={lang}
          onToggleLang={handleToggleLang}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col">
          {/* Main Home Screen: Contains ONLY activity tabs without extra explanations */}
          {currentMode === 'home' && (
            <HomeScreen
              onSelectMode={setCurrentMode}
              lang={lang}
            />
          )}

          {/* Activity Screen: Displays ONLY the chosen activity */}
          {currentMode === 'explore' && (
            <ExploreMode
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              onChangeTime={(h, m) => {
                setHours(h);
                setMinutes(m);
              }}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              lang={lang}
            />
          )}

          {currentMode === 'set-clock' && (
            <SetClockGame
              onEarnStar={handleEarnStar}
              lang={lang}
            />
          )}

          {currentMode === 'quiz' && (
            <QuizMode
              onEarnStar={handleEarnStar}
              lang={lang}
            />
          )}

          {currentMode === 'routine' && (
            <DailyRoutineMode
              onEarnStar={handleEarnStar}
              lang={lang}
            />
          )}
        </main>

        {/* Clean Footer */}
        <footer className="w-full bg-white border-t border-slate-200/80 py-4 px-6 text-center text-sm md:text-base text-slate-700 font-bold shadow-xs">
          <p>
            {lang === 'en'
              ? 'My Interactive Clock • Fun Learning • Ranim Fay • All Rights Reserved'
              : 'سَاعَتِي التَّفَاعُلِيَّةُ - التَّعَلُّمُ الْمُمْتِعُ - رنيم فاي - جَمِيعُ الْحُقُوقِ مَحْفُوظَةٌ'}
          </p>
        </footer>
      </div>
    </div>
  );
}
