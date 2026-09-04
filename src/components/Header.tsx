import React from 'react';
import { AppMode, Language } from '../types';
import { Clock, Gamepad2, HelpCircle, Calendar, Volume2, VolumeX, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentMode: AppMode;
  onBackToHome: () => void;
  starsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onBackToHome,
  starsCount,
  soundEnabled,
  onToggleSound,
  lang,
}) => {
  const activityNames: Record<Exclude<AppMode, 'home'>, { ar: string; en: string; icon: React.ComponentType<{ className?: string }> }> = {
    explore: { ar: 'اِسْتِكْشَافُ السَّاعَةِ', en: 'Explore Clock', icon: Clock },
    'set-clock': { ar: 'اِضْبِطِ السَّاعَةَ', en: 'Set the Clock', icon: Gamepad2 },
    quiz: { ar: 'اخْتِبَارُ السَّاعَةِ', en: 'Clock Quiz', icon: HelpCircle },
    routine: { ar: 'الرُّوتِينُ الْيَوْمِيُّ', en: 'Daily Routine', icon: Calendar },
  };

  const isHome = currentMode === 'home';
  const ActiveIcon = !isHome ? activityNames[currentMode].icon : Clock;
  const activeTitle = !isHome ? (lang === 'en' ? activityNames[currentMode].en : activityNames[currentMode].ar) : '';

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3">
        {/* Left / Start Side: Back Button if in Activity OR Logo if Home */}
        {isHome ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {lang === 'en' ? 'My Interactive Clock' : 'سَاعَتِي التَّفَاعُلِيَّةُ'}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-900/80">
                {lang === 'en' ? 'Grade 2 Primary' : 'السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Prominent Back to Home Button (زر رجوع إلى الواجهة الرئيسية) */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm sm:text-base transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              title={lang === 'en' ? 'Back to Home' : 'الرُّجُوعُ إِلَى الْوَاجِهَةِ الرَّئِيسِيَّةِ'}
            >
              {lang === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{lang === 'en' ? 'Home' : 'الرَّئِيسِيَّةُ'}</span>
            </button>

            {/* Current Activity Title */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200">
              <ActiveIcon className="w-5 h-5 text-amber-700" />
              <span className="font-black text-base sm:text-lg text-amber-950">
                {activeTitle}
              </span>
            </div>
          </div>
        )}

        {/* Right Side: Essential Utilities ONLY (Sound + Stars) */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2.5 rounded-2xl border-2 transition cursor-pointer active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-300'
            }`}
            title={
              soundEnabled
                ? lang === 'en' ? 'Mute sound' : 'كَتْمُ الصَّوْتِ'
                : lang === 'en' ? 'Enable sound' : 'تَشْغِيلُ الصَّوْتِ'
            }
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Stars Counter */}
          <div className="flex items-center gap-2 bg-amber-500 text-white px-3.5 sm:px-4 py-2 rounded-2xl shadow-sm text-sm sm:text-base font-black border border-amber-600">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white animate-bounce" />
            <span>
              {lang === 'en'
                ? `${starsCount} ${starsCount === 1 ? 'Star' : 'Stars'}`
                : `${starsCount} ${starsCount === 1 ? 'نَجْمَةٌ' : starsCount === 2 ? 'نَجْمَتَانِ' : starsCount <= 10 ? 'نُجُومٍ' : 'نَجْمَةً'}`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
