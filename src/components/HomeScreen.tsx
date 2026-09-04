import React from 'react';
import { AppMode, Language } from '../types';
import { Clock, Gamepad2, HelpCircle, Calendar, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HomeScreenProps {
  onSelectMode: (mode: AppMode) => void;
  lang?: Language;
}

interface ActivityTabItem {
  id: AppMode;
  titleAr: string;
  titleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  colorGradient: string;
  borderColor: string;
  shadowColor: string;
  badgeBg: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  lang = 'ar',
}) => {
  const tabs: ActivityTabItem[] = [
    {
      id: 'explore',
      titleAr: 'اِسْتِكْشَافُ السَّاعَةِ',
      titleEn: 'Explore Clock',
      icon: Clock,
      colorGradient: 'from-amber-500 to-amber-600',
      borderColor: 'border-amber-300 hover:border-amber-400',
      shadowColor: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-100 text-amber-950',
    },
    {
      id: 'set-clock',
      titleAr: 'اِضْبِطِ السَّاعَةَ',
      titleEn: 'Set the Clock',
      icon: Gamepad2,
      colorGradient: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-300 hover:border-emerald-400',
      shadowColor: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-100 text-emerald-950',
    },
    {
      id: 'quiz',
      titleAr: 'اخْتِبَارُ السَّاعَةِ',
      titleEn: 'Clock Quiz',
      icon: HelpCircle,
      colorGradient: 'from-indigo-500 to-indigo-600',
      borderColor: 'border-indigo-300 hover:border-indigo-400',
      shadowColor: 'shadow-indigo-500/20',
      badgeBg: 'bg-indigo-100 text-indigo-950',
    },
    {
      id: 'routine',
      titleAr: 'الرُّوتِينُ الْيَوْمِيُّ',
      titleEn: 'Daily Routine',
      icon: Calendar,
      colorGradient: 'from-rose-500 to-rose-600',
      borderColor: 'border-rose-300 hover:border-rose-400',
      shadowColor: 'shadow-rose-500/20',
      badgeBg: 'bg-rose-100 text-rose-950',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto py-6 sm:py-10 px-4">
      {/* Visual Welcome Emblem */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-sm sm:text-base font-black shadow-xs mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{lang === 'en' ? 'Fun Learning - Ranim Fay' : '✨️ التّعلّم الممتِع - رنيم فاي ✨️'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          {lang === 'en' ? 'Select an Activity:' : 'اخْتَرْ نَشَاطًا:'}
        </h2>
      </div>

      {/* Clean Grid of Activity Tabs - Names Only Without Superfluous Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const title = lang === 'en' ? tab.titleEn : tab.titleAr;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectMode(tab.id);
              }}
              className={`group relative flex items-center gap-4 p-5 sm:p-6 rounded-3xl bg-white border-3 ${tab.borderColor} shadow-md ${tab.shadowColor} hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 cursor-pointer text-right select-none`}
            >
              {/* Vibrant Icon Box */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${tab.colorGradient} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              {/* Title Only */}
              <div className="flex-1">
                <span className="text-xl sm:text-2xl md:text-2xl font-black text-slate-900 group-hover:text-amber-700 transition-colors block">
                  {title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
