import React, { useState } from 'react';
import { Volume2, Sun, Moon, Sunrise, Sunset, Plus, Minus, Sparkles } from 'lucide-react';
import { formatSpokenTime, formatDigitalTime, getPeriodOfDay, formatArabicSpokenTime } from '../utils/timeFormatters';
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
  const phoneticArabic = formatArabicSpokenTime(hours, minutes, true, true);

  const handleSpeak = () => {
    setIsSpeaking(true);
    if (currentLang === 'en') {
      sounds.speakEnglish(spokenPhrase, () => {
        setIsSpeaking(false);
      });
    } else {
      sounds.speakArabic(phoneticArabic, () => {
        setIsSpeaking(false);
      });
    }
    // Safety timeout in case onend is delayed
    setTimeout(() => setIsSpeaking(false), 3000);
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
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between flex-1 min-h-0 overflow-y-auto app-scrollable-card gap-2.5 sm:gap-3">
      {/* Top Banner: Period of Day */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 flex-wrap shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            {renderPeriodIcon()}
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>{lang === 'en' ? 'Time of Day:' : 'فَتْرَةُ الْيَوْمِ:'}</span>
              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg font-black border border-amber-300 text-xs sm:text-sm">
                {periodInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-0.5">{periodInfo.subText}</p>
          </div>
        </div>

        {/* AM / PM Toggle */}
        <button
          onClick={toggleAmPm}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-black transition border border-slate-200 cursor-pointer active:scale-95 shadow-2xs"
          title={lang === 'en' ? 'Switch between AM and PM' : 'تَبْدِيلُ الْفَتْرَةِ بَيْنَ صَبَاحًا وَمَسَاءً'}
        >
          <span>{lang === 'en' ? 'Switch to:' : 'التَّبْدِيلُ إِلَى:'}</span>
          <span className="text-amber-700 font-black">
            {lang === 'en' ? (digital.isPm ? 'AM' : 'PM') : (digital.isPm ? 'صَبَاحًا (ص)' : 'مَسَاءً (م)')}
          </span>
        </button>
      </div>

      {/* Big Digital Display Box */}
      <div className="flex flex-col items-center justify-center py-3.5 sm:py-5 px-3 bg-slate-900 text-white rounded-2xl shadow-inner border border-slate-700 relative overflow-hidden shrink-0">
        <div className={`absolute top-2 ${lang === 'en' ? 'left-3' : 'right-3'} flex items-center gap-1 text-[11px] sm:text-xs text-slate-300 font-bold`}>
          <span>{lang === 'en' ? 'DIGITAL CLOCK' : 'السَّاعَةُ الرَّقَمِيَّةُ'}</span>
        </div>

        <div className="flex items-baseline justify-center gap-3 font-mono mt-2">
          {/* Main Digits */}
          <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-amber-400 drop-shadow">
            {digital.time12}
          </div>

          {/* AM / PM indicator */}
          <div className="text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
            {lang === 'en' ? digital.period12En : (digital.isPm ? 'مَسَاءً' : 'صَبَاحًا')}
          </div>
        </div>
      </div>

      {/* Spoken Time Box with Prominent Slow-Paced TTS */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs shrink-0">
        <div className={`flex-1 text-center ${lang === 'en' ? 'sm:text-left' : 'sm:text-right'}`}>
          <div className={`text-xs font-black text-amber-900 mb-1 flex items-center justify-center ${lang === 'en' ? 'sm:justify-start' : 'sm:justify-start'} gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'en' ? 'HOW TO SAY THE TIME:' : 'نُطْقُ وَقِرَاءَةُ السَّاعَةِ (مُشَكَّلَةٌ):'}</span>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 leading-relaxed font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
            {spokenPhrase}
          </div>
        </div>

        <button
          id="listen-spoken-time-btn"
          onClick={handleSpeak}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
          title={lang === 'en' ? 'Listen to pronunciation' : 'اِسْتَمِعْ لِنُطْقِ السَّاعَةِ'}
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span>
            {isSpeaking
              ? (lang === 'en' ? 'Speaking...' : 'جَارٍ النُّطْقُ...')
              : (lang === 'en' ? 'Listen 🔊' : 'اِسْتَمِعْ 🔊')}
          </span>
        </button>
      </div>

      {/* Step Adjustment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 shrink-0">
        {/* Hours Stepper */}
        <div className="flex items-center justify-between bg-red-50 p-2 rounded-xl border border-red-200">
          <button
            onClick={() => adjustHours(-1)}
            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 1 hour' : 'إِنْقَاصُ سَاعَةٍ'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-red-950">{lang === 'en' ? 'Hour (±1)' : 'سَاعَةٌ (1±)'}</span>
          <button
            onClick={() => adjustHours(1)}
            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 1 hour' : 'زِيَادَةُ سَاعَةٍ'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 15 Minutes Stepper (Quarters) */}
        <div className="flex items-center justify-between bg-blue-50 p-2 rounded-xl border border-blue-200">
          <button
            onClick={() => adjustMinutes(-15)}
            className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 15 mins' : 'إِنْقَاصُ 15 د'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-blue-950">{lang === 'en' ? '15 Min' : 'رُبْعٌ (15±)'}</span>
          <button
            onClick={() => adjustMinutes(15)}
            className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 15 mins' : 'زِيَادَةُ 15 د'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Minutes Stepper */}
        <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-xl border border-emerald-200">
          <button
            onClick={() => adjustMinutes(-5)}
            className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 5 mins' : 'إِنْقَاصُ 5 د'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-emerald-950">{lang === 'en' ? '5 Min' : '5 دَقَائِقَ'}</span>
          <button
            onClick={() => adjustMinutes(5)}
            className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 5 mins' : 'زِيَادَةُ 5 د'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 1 Minute Stepper */}
        <div className="flex items-center justify-between bg-purple-50 p-2 rounded-xl border border-purple-200">
          <button
            onClick={() => adjustMinutes(-1)}
            className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 1 min' : 'إِنْقَاصُ دَقِيقَةٍ'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-purple-950">{lang === 'en' ? '1 Min' : 'دَقِيقَةٌ'}</span>
          <button
            onClick={() => adjustMinutes(1)}
            className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 1 min' : 'زِيَادَةُ دَقِيقَةٍ'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

