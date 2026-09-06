import React, { useState } from 'react';
import { Volume2, Sun, Moon, Sunrise, Sunset, Plus, Minus, Sparkles } from 'lucide-react';
import { formatDigitalTime, getPeriodOfDay, getArabicHourName } from '../utils/timeFormatters';
import { sounds } from '../utils/soundEffects';
import { Language } from '../types';

interface DigitalDisplayProps {
  hours: number;
  minutes: number;
  seconds?: number;
  onChangeTime: (hours: number, minutes: number) => void;
  lang?: Language;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  hours,
  minutes,
  seconds = 0,
  onChangeTime,
  lang = 'en' as Language,
}) => {
  const currentLang: Language = lang as Language;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const digital = formatDigitalTime(hours, minutes, seconds);
  const periodInfo = getPeriodOfDay(hours, currentLang);

  const handleReadClock = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    sounds.playClick();

    if (currentLang === 'en') {
      const minText = digital.min === 0 ? "o'clock" : digital.min < 10 ? `oh ${digital.min}` : `${digital.min}`;
      const text = `The time is ${digital.h12} ${minText} ${digital.period12En}`;
      sounds.speakEnglish(text, () => {
        setIsSpeaking(false);
      });
    } else {
      const minWord =
        digital.min === 0
          ? 'تَمَامًا'
          : digital.min === 15
          ? 'وَالرُّبْعُ'
          : digital.min === 30
          ? 'وَالنِّصْفُ'
          : digital.min === 45
          ? 'إِلَّا رُبْعًا'
          : `وَ ${digital.min} دَقِيقَةً`;
      const periodWord = digital.isPm ? 'مَسَاءً' : 'صَبَاحًا';
      const text = `تُشِيرُ السَّاعَةُ إِلَى ${getArabicHourName(digital.h12, true)} ${minWord} ${periodWord}`;
      sounds.speakArabic(text, () => {
        setIsSpeaking(false);
      });
    }
    setTimeout(() => setIsSpeaking(false), 3200);
  };

  const adjustHours = (delta: number) => {
    sounds.playClick();
    const newH = (hours + delta + 24) % 24;
    onChangeTime(newH, minutes);
  };

  const adjustMinutes = (delta: number) => {
    sounds.playClick();
    let totalMinutes = hours * 60 + minutes + delta;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    totalMinutes = totalMinutes % (24 * 60);

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    onChangeTime(newH, newM);
  };

  const toggleAmPm = () => {
    sounds.playClick();
    const newH = (hours + 12) % 24;
    onChangeTime(newH, minutes);
  };

  const renderPeriodIcon = () => {
    switch (periodInfo.icon) {
      case 'morning':
        return <Sunrise className="w-5 h-5 text-amber-500" />;
      case 'afternoon':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'evening':
        return <Sunset className="w-5 h-5 text-orange-500" />;
      case 'night':
        return <Moon className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between flex-1 min-h-0 overflow-y-auto app-scrollable-card gap-3">
      {/* 1. Period of Day Banner, AM/PM Toggle & Read Clock Voice Button */}
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-amber-50/90 rounded-2xl border border-amber-200/90 flex-wrap shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white border border-amber-200 shadow-2xs">
            {renderPeriodIcon()}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{lang === 'en' ? 'Period:' : 'فَتْرَةُ الْيَوْمِ:'}</span>
              <span className="text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-lg font-black border border-amber-300 text-xs">
                {periodInfo.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Read Clock Button */}
          <button
            id="read-clock-btn"
            onClick={handleReadClock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95 cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
            title={lang === 'en' ? 'Read Clock' : 'قِرَاءَةُ السَّاعَةِ'}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>
              {isSpeaking
                ? (lang === 'en' ? 'Reading...' : 'جَارٍ الْقِرَاءَةُ...')
                : (lang === 'en' ? 'Read Clock 🔊' : 'قِرَاءَةُ السَّاعَةِ 🔊')}
            </span>
          </button>

          {/* AM / PM Toggle */}
          <button
            id="toggle-am-pm-btn"
            onClick={toggleAmPm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black transition border border-slate-300 cursor-pointer active:scale-95 shadow-2xs"
            title={lang === 'en' ? 'Switch between AM and PM' : 'تَبْدِيلُ الْفَتْرَةِ بَيْنَ صَبَاحًا وَمَسَاءً'}
          >
            <span>{lang === 'en' ? 'Switch:' : 'التَّبْدِيلُ:'}</span>
            <span className="text-amber-700 font-black">
              {lang === 'en' ? (digital.isPm ? 'AM' : 'PM') : (digital.isPm ? 'صَبَاحًا (ص)' : 'مَسَاءً (م)')}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Step Adjustment Controls (ساعة، نصف، ربع، 5 دقائق، دقيقة) */}
      <div className="flex-1 flex flex-col justify-center gap-2 min-h-0">
        <div className="text-xs font-black text-slate-600 flex items-center gap-1.5 px-1 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>
            {lang === 'en'
              ? 'STEP ADJUSTMENT CONTROLS (HOUR, HALF, QUARTER, MINUTE):'
              : 'أَزْرَارُ زِيَادَةِ وَإِنْقَاصِ الْوَقْتِ (سَاعَةٌ، نِصْفٌ، رُبْعٌ، دَقِيقَةٌ):'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {/* 1. Hours Stepper (ساعة) */}
          <div className="flex items-center justify-between bg-red-50/90 p-2 sm:p-2.5 rounded-2xl border border-red-200 shadow-2xs">
            <button
              onClick={() => adjustHours(-1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer border border-red-300/60"
              title={lang === 'en' ? 'Decrease 1 hour' : 'إِنْقَاصُ سَاعَةٍ (-1 س)'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center px-1">
              <span className="text-xs sm:text-sm font-black text-red-950 block">
                {lang === 'en' ? 'Hour' : 'سَاعَةٌ'}
              </span>
              <span className="text-[10px] font-bold text-red-600 block">±1h</span>
            </div>
            <button
              onClick={() => adjustHours(1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer border border-red-300/60"
              title={lang === 'en' ? 'Increase 1 hour' : 'زِيَادَةُ سَاعَةٍ (+1 س)'}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Half Hour Stepper (نصف ساعة) */}
          <div className="flex items-center justify-between bg-amber-50/90 p-2 sm:p-2.5 rounded-2xl border border-amber-200 shadow-2xs">
            <button
              onClick={() => adjustMinutes(-30)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-800 flex items-center justify-center font-black transition cursor-pointer border border-amber-300/60"
              title={lang === 'en' ? 'Decrease 30 mins' : 'إِنْقَاصُ نِصْفِ سَاعَةٍ (-30 د)'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center px-1">
              <span className="text-xs sm:text-sm font-black text-amber-950 block">
                {lang === 'en' ? 'Half Hour' : 'نِصْفُ سَاعَةٍ'}
              </span>
              <span className="text-[10px] font-bold text-amber-700 block">±30m</span>
            </div>
            <button
              onClick={() => adjustMinutes(30)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-800 flex items-center justify-center font-black transition cursor-pointer border border-amber-300/60"
              title={lang === 'en' ? 'Increase 30 mins' : 'زِيَادَةُ نِصْفِ سَاعَةٍ (+30 د)'}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Quarter Hour Stepper (ربع ساعة) */}
          <div className="flex items-center justify-between bg-blue-50/90 p-2 sm:p-2.5 rounded-2xl border border-blue-200 shadow-2xs">
            <button
              onClick={() => adjustMinutes(-15)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer border border-blue-300/60"
              title={lang === 'en' ? 'Decrease 15 mins' : 'إِنْقَاصُ رُبْعِ سَاعَةٍ (-15 د)'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center px-1">
              <span className="text-xs sm:text-sm font-black text-blue-950 block">
                {lang === 'en' ? 'Quarter' : 'رُبْعُ سَاعَةٍ'}
              </span>
              <span className="text-[10px] font-bold text-blue-600 block">±15m</span>
            </div>
            <button
              onClick={() => adjustMinutes(15)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer border border-blue-300/60"
              title={lang === 'en' ? 'Increase 15 mins' : 'زِيَادَةُ رُبْعِ سَاعَةٍ (+15 د)'}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 4. 5 Minutes Stepper (5 دقائق) */}
          <div className="flex items-center justify-between bg-emerald-50/90 p-2 sm:p-2.5 rounded-2xl border border-emerald-200 shadow-2xs">
            <button
              onClick={() => adjustMinutes(-5)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer border border-emerald-300/60"
              title={lang === 'en' ? 'Decrease 5 mins' : 'إِنْقَاصُ 5 دَقَائِقَ (-5 د)'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center px-1">
              <span className="text-xs sm:text-sm font-black text-emerald-950 block">
                {lang === 'en' ? '5 Minutes' : '5 دَقَائِقَ'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 block">±5m</span>
            </div>
            <button
              onClick={() => adjustMinutes(5)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer border border-emerald-300/60"
              title={lang === 'en' ? 'Increase 5 mins' : 'زِيَادَةُ 5 دَقَائِقَ (+5 د)'}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 5. 1 Minute Stepper (دقيقة) */}
          <div className="flex items-center justify-between bg-purple-50/90 p-2 sm:p-2.5 rounded-2xl border border-purple-200 shadow-2xs col-span-2 sm:col-span-1">
            <button
              onClick={() => adjustMinutes(-1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer border border-purple-300/60"
              title={lang === 'en' ? 'Decrease 1 min' : 'إِنْقَاصُ دَقِيقَةٍ (-1 د)'}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-center px-1">
              <span className="text-xs sm:text-sm font-black text-purple-950 block">
                {lang === 'en' ? '1 Minute' : 'دَقِيقَةٌ'}
              </span>
              <span className="text-[10px] font-bold text-purple-600 block">±1m</span>
            </div>
            <button
              onClick={() => adjustMinutes(1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer border border-purple-300/60"
              title={lang === 'en' ? 'Increase 1 min' : 'زِيَادَةُ دَقِيقَةٍ (+1 د)'}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

