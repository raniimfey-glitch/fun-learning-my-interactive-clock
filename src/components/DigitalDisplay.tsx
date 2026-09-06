import React, { useState } from 'react';
import { Volume2, Sun, Moon, Sunrise, Sunset, Plus, Minus, Sparkles } from 'lucide-react';
import { formatSpokenTime, formatDigitalTime, getPeriodOfDay, formatArabicSpokenTime, getArabicHourName } from '../utils/timeFormatters';
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
  lang = 'en',
}: {
  hours: number;
  minutes: number;
  seconds?: number;
  onChangeTime: (hours: number, minutes: number) => void;
  lang?: Language;
}) => {
  const currentLang: Language = lang || 'en';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const digital = formatDigitalTime(hours, minutes, seconds);
  const periodInfo = getPeriodOfDay(hours, currentLang);
  const spokenPhrase = formatSpokenTime(hours, minutes, currentLang, true, false);

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
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200/80 flex flex-col justify-between flex-1 min-h-0 overflow-y-auto app-scrollable-card gap-2 sm:gap-2.5">
      {/* 1. Spoken Time Card with Prominent Read Clock Button (بدون كلمة المحرك) */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs shrink-0">
        <div className={`flex-1 text-center ${lang === 'en' ? 'sm:text-left' : 'sm:text-right'}`}>
          <div className="text-xs font-black text-amber-900 mb-1 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{lang === 'en' ? 'HOW TO SAY & READ THE TIME:' : 'نُطْقُ وَقِرَاءَةُ السَّاعَةِ (بِالْكَلِمَاتِ):'}</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 leading-relaxed font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
            {spokenPhrase}
          </div>
        </div>

        {/* زر قراءة الساعة - واضح ومميز وبدون كلمة المحرك */}
        <button
          id="read-clock-btn"
          onClick={handleReadClock}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer ${
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
      </div>

      {/* 3. Period of Day Banner & AM/PM Switch */}
      <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
            {renderPeriodIcon()}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>{lang === 'en' ? 'Period:' : 'فَتْرَةُ الْيَوْمِ:'}</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-black border border-amber-300 text-xs">
                {periodInfo.name}
              </span>
            </div>
          </div>
        </div>

        {/* AM / PM Toggle */}
        <button
          onClick={toggleAmPm}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-black transition border border-slate-300 cursor-pointer active:scale-95 shadow-2xs"
          title={lang === 'en' ? 'Switch between AM and PM' : 'تَبْدِيلُ الْفَتْرَةِ بَيْنَ صَبَاحًا وَمَسَاءً'}
        >
          <span>{lang === 'en' ? 'Switch to:' : 'التَّبْدِيلُ إِلَى:'}</span>
          <span className="text-amber-700 font-black">
            {lang === 'en' ? (digital.isPm ? 'AM' : 'PM') : (digital.isPm ? 'صَبَاحًا (ص)' : 'مَسَاءً (م)')}
          </span>
        </button>
      </div>

      {/* 4. Step Adjustment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 pt-0.5 shrink-0">
        {/* Hours Stepper */}
        <div className="flex items-center justify-between bg-red-50 p-1.5 sm:p-2 rounded-xl border border-red-200">
          <button
            onClick={() => adjustHours(-1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 1 hour' : 'إِنْقَاصُ سَاعَةٍ'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-black text-red-950">{lang === 'en' ? 'Hour' : 'سَاعَةٌ'}</span>
          <button
            onClick={() => adjustHours(1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 1 hour' : 'زِيَادَةُ سَاعَةٍ'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 15 Minutes Stepper (Quarters) */}
        <div className="flex items-center justify-between bg-blue-50 p-1.5 sm:p-2 rounded-xl border border-blue-200">
          <button
            onClick={() => adjustMinutes(-15)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 15 mins' : 'إِنْقَاصُ 15 د'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-black text-blue-950">{lang === 'en' ? '15 Min' : 'رُبْعٌ (15)'}</span>
          <button
            onClick={() => adjustMinutes(15)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 15 mins' : 'زِيَادَةُ 15 د'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Minutes Stepper */}
        <div className="flex items-center justify-between bg-emerald-50 p-1.5 sm:p-2 rounded-xl border border-emerald-200">
          <button
            onClick={() => adjustMinutes(-5)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 5 mins' : 'إِنْقَاصُ 5 د'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-black text-emerald-950">{lang === 'en' ? '5 Min' : '5 دَقَائِقَ'}</span>
          <button
            onClick={() => adjustMinutes(5)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 5 mins' : 'زِيَادَةُ 5 د'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1 Minute Stepper */}
        <div className="flex items-center justify-between bg-purple-50 p-1.5 sm:p-2 rounded-xl border border-purple-200">
          <button
            onClick={() => adjustMinutes(-1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 1 min' : 'إِنْقَاصُ دَقِيقَةٍ'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-black text-purple-950">{lang === 'en' ? '1 Min' : 'دَقِيقَةٌ'}</span>
          <button
            onClick={() => adjustMinutes(1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 1 min' : 'زِيَادَةُ دَقِيقَةٍ'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

