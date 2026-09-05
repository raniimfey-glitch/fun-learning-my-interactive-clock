import React from 'react';
import { AppMode, Language } from '../types';
import { BookOpen, Clock, Gamepad2, HelpCircle, Calendar, Volume2, VolumeX, Star, ArrowRight, ArrowLeft, Languages } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentMode: AppMode;
  onBackToHome: () => void;
  starsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onBackToHome,
  starsCount,
  soundEnabled,
  onToggleSound,
  lang,
  onToggleLang,
}) => {
  const activityNames: Record<Exclude<AppMode, 'home'>, { ar: string; en: string; icon: React.ComponentType<{ className?: string }> }> = {
    guide: { ar: 'دَلِيلُ الدَّرْسِ', en: 'Lesson Guide', icon: BookOpen },
    explore: { ar: 'اِسْتِكْشَافُ السَّاعَةِ', en: 'Explore Clock', icon: Clock },
    'set-clock': { ar: 'اِضْبِطِ السَّاعَةَ', en: 'Set the Clock', icon: Gamepad2 },
    quiz: { ar: 'اخْتِبَارُ السَّاعَةِ', en: 'Clock Quiz', icon: HelpCircle },
    routine: { ar: 'الرُّوتِينُ الْيَوْمِيُّ', en: 'Daily Routine', icon: Calendar },
  };

  const isHome = currentMode === 'home';
  const ActiveIcon = !isHome ? activityNames[currentMode].icon : Clock;
  const activeTitle = !isHome ? (lang === 'en' ? activityNames[currentMode].en : activityNames[currentMode].ar) : '';

  return (
    <header className="app-header-top shrink-0 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 z-30 shadow-2xs">
      <div className="max-w-[900px] w-full mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left / Start Side: Back Button if in Activity OR Logo if Home */}
        {isHome ? (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
              <Clock className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {lang === 'en' ? 'My Interactive Clock' : 'سَاعَتِي التَّفَاعُلِيَّةُ'}
              </h1>
              <p className="text-[11px] sm:text-xs font-bold text-amber-900/80">
                {lang === 'en' ? 'Grade 2 Primary' : 'السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prominent Back to Home Button (زر رجوع إلى الواجهة الرئيسية) */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
              title={lang === 'en' ? 'Back to Home' : 'الرُّجُوعُ إِلَى الْوَاجِهَةِ الرَّئِيسِيَّةِ'}
            >
              {lang === 'ar' ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>{lang === 'en' ? 'Home' : 'الرَّئِيسِيَّةُ'}</span>
            </button>

            {/* Current Activity Title */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-amber-50 border border-amber-200">
              <ActiveIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-700" />
              <span className="font-black text-xs sm:text-sm text-amber-950 truncate max-w-[130px] sm:max-w-none">
                {activeTitle}
              </span>
            </div>
          </div>
        )}

        {/* Right Side: Essential Utilities (Language + Sound + Stars) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher (العربية / English) */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleLang();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 text-xs sm:text-sm font-black transition-all shadow-2xs cursor-pointer active:scale-95"
            title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
          >
            <Languages className="w-4 h-4 text-amber-600" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

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
