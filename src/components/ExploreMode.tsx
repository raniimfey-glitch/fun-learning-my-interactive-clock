import React from 'react';
import { InteractiveClock } from './InteractiveClock';
import { DigitalDisplay } from './DigitalDisplay';
import { ClockSettings, Language } from '../types';
import { Clock, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { getArabicHourName } from '../utils/timeFormatters';

interface ExploreModeProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChangeTime: (hours: number, minutes: number) => void;
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
  lang?: Language;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({
  hours,
  minutes,
  seconds,
  onChangeTime,
  settings,
  onUpdateSettings,
  lang = 'en',
}) => {
  const handleReadClock = () => {
    sounds.playClick();
    const h12 = hours % 12 || 12;
    const isPm = hours >= 12;
    if (lang === 'en') {
      const minText = minutes === 0 ? "o'clock" : minutes < 10 ? `oh ${minutes}` : `${minutes}`;
      sounds.speakEnglish(`The time is ${h12} ${minText} ${isPm ? 'PM' : 'AM'}`);
    } else {
      const minWord =
        minutes === 0
          ? 'تَمَامًا'
          : minutes === 15
          ? 'وَالرُّبْعُ'
          : minutes === 30
          ? 'وَالنِّصْفُ'
          : minutes === 45
          ? 'إِلَّا رُبْعًا'
          : `وَ ${minutes} دَقِيقَةً`;
      const periodWord = isPm ? 'مَسَاءً' : 'صَبَاحًا';
      sounds.speakArabic(`تُشِيرُ السَّاعَةُ إِلَى ${getArabicHourName(h12, true)} ${minWord} ${periodWord}`);
    }
  };
  return (
    <div className="app-game-card w-full flex-1 min-h-0 flex flex-col md:flex-row gap-2.5 sm:gap-3.5 items-stretch overflow-hidden">
      {/* Left Column: The Interactive Clock Face */}
      <div className="w-full md:w-[340px] lg:w-[380px] bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between shrink-0 overflow-hidden">
        {/* Helper Note for Kids & Live Time Toggle */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 mb-1 px-1 shrink-0">
          <span className="flex items-center gap-1.5 text-amber-800 truncate">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">
              {lang === 'en'
                ? 'Drag hands directly:'
                : 'حَرِّكِ الْعَقَارِبَ مُبَاشَرَةً:'}
            </span>
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ isLiveTime: !settings.isLiveTime });
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
              settings.isLiveTime
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {settings.isLiveTime
                ? (lang === 'en' ? 'Live Time 🔴' : 'الْوَقْتُ الْحَيُّ 🔴')
                : (lang === 'en' ? 'Current Time' : 'الْوَقْتُ الْحَالِيُّ')}
            </span>
          </button>
        </div>

        {/* The Clock Component */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden py-1">
          <InteractiveClock
            hours={hours}
            minutes={minutes}
            seconds={settings.isLiveTime ? seconds : undefined}
            interactive={!settings.isLiveTime}
            onChangeTime={onChangeTime}
            showMinuteRing={false}
            showFractionsOverlay={false}
            showHandLabels={true}
            size={290}
            lang={lang}
            onReadClock={handleReadClock}
          />
        </div>
      </div>

      {/* Right Column: Digital Display & Step Controls */}
      <div className="w-full md:flex-1 min-h-0 flex flex-col shrink-1 overflow-hidden">
        <DigitalDisplay
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onChangeTime={onChangeTime}
          lang={lang}
        />
      </div>
    </div>
  );
};

