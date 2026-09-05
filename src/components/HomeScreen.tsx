import React from 'react';
import { AppMode, Language } from '../types';
import { BookOpen, Clock, Gamepad2, HelpCircle, Calendar, Sparkles } from 'lucide-react';
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
      id: 'guide',
      titleAr: 'دَلِيلُ الدَّرْسِ',
      titleEn: 'Lesson Guide',
      icon: BookOpen,
      colorGradient: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-300 hover:border-blue-400',
      shadowColor: 'shadow-blue-500/20',
      badgeBg: 'bg-blue-100 text-blue-950',
    },
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
    <div className="flex-1 min-h-0 w-full flex flex-col justify-center items-center py-2 px-2 overflow-hidden">
      {/* Visual Welcome Emblem */}
      <div className="flex flex-col items-center text-center mb-3 sm:mb-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm font-black shadow-2xs mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'en' ? 'Fun Learning - Ranim Fay' : '✨️ التّعلّم الممتِع - رنيم فاي ✨️'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          {lang === 'en' ? 'Select an Activity:' : 'اخْتَرْ نَشَاطًا:'}
        </h2>
      </div>

      {/* Clean Grid of Activity Tabs - Names Only Without Superfluous Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-[850px] shrink-1">
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
              className={`group relative flex items-center gap-3 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border-2 sm:border-3 ${tab.borderColor} shadow-xs ${tab.shadowColor} hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer text-right select-none ${
                tab.id === 'guide' ? 'sm:col-span-2' : ''
              }`}
            >
              {/* Vibrant Icon Box */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${tab.colorGradient} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Title Only */}
              <div className="flex-1 min-w-0">
                <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors block truncate">
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
