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
    <div className="w-full bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4">
      {/* Top Banner: Period of Day */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
            {renderPeriodIcon()}
          </div>
          <div>
            <div className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2 flex-wrap">
              <span>{lang === 'en' ? 'Time of Day:' : 'فَتْرَةُ الْيَوْمِ:'}</span>
              <span className="text-amber-800 bg-amber-100 px-3 py-0.5 rounded-lg font-black border border-amber-300">
                {periodInfo.name}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-bold mt-0.5">{periodInfo.subText}</p>
          </div>
        </div>

        {/* AM / PM Toggle */}
        <button
          onClick={toggleAmPm}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-black transition border-2 border-slate-200 cursor-pointer active:scale-95 shadow-2xs"
          title={lang === 'en' ? 'Switch between AM and PM' : 'تَبْدِيلُ الْفَتْرَةِ بَيْنَ صَبَاحًا وَمَسَاءً'}
        >
          <span>{lang === 'en' ? 'Switch to:' : 'التَّبْدِيلُ إِلَى:'}</span>
          <span className="text-amber-700 font-black">
            {lang === 'en' ? (digital.isPm ? 'AM (Morning)' : 'PM (Afternoon/Night)') : (digital.isPm ? 'صَبَاحًا (ص)' : 'مَسَاءً (م)')}
          </span>
        </button>
      </div>

      {/* Big Digital Display Box */}
      <div className="flex flex-col items-center justify-center py-5 px-4 bg-slate-900 text-white rounded-3xl shadow-inner border-2 border-slate-700 relative overflow-hidden">
        <div className={`absolute top-2.5 ${lang === 'en' ? 'left-4' : 'right-4'} flex items-center gap-1.5 text-xs md:text-sm text-slate-300 font-bold`}>
          <span>{lang === 'en' ? 'DIGITAL CLOCK' : 'السَّاعَةُ الرَّقَمِيَّةُ'}</span>
        </div>

        <div className="flex items-baseline justify-center gap-4 font-mono mt-3">
          {/* Main Digits */}
          <div className="text-5xl md:text-7xl font-black tracking-wider text-amber-400 drop-shadow">
            {digital.time12}
          </div>

          {/* AM / PM indicator */}
          <div className="text-base md:text-lg font-black px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 border border-slate-700">
            {lang === 'en' ? digital.period12En : (digital.isPm ? 'مَسَاءً' : 'صَبَاحًا')}
          </div>
        </div>
      </div>

      {/* Spoken Time Box with Prominent Slow-Paced TTS */}
      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className={`flex-1 text-center ${lang === 'en' ? 'sm:text-left' : 'sm:text-right'}`}>
          <div className={`text-sm font-black text-amber-900 mb-1.5 flex items-center justify-center ${lang === 'en' ? 'sm:justify-start' : 'sm:justify-start'} gap-1.5`}>
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{lang === 'en' ? 'HOW TO SAY AND READ THE TIME:' : 'نُطْقُ وَقِرَاءَةُ السَّاعَةِ بِالْعَرَبِيَّةِ الْفُصْحَى (مُشَكَّلَةٌ):'}</span>
          </div>
          <div className="text-xl md:text-3xl font-black text-slate-950 leading-relaxed font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
            {spokenPhrase}
          </div>
        </div>

        <button
          id="listen-spoken-time-btn"
          onClick={handleSpeak}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-base md:text-lg font-black transition-all shadow-md active:scale-95 shrink-0 cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-300'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
          title={lang === 'en' ? 'Listen to slow and clear English pronunciation' : 'اِسْتَمِعْ إِلَى نُطْقِ السَّاعَةِ صَوْتِيًّا'}
        >
          <Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span>
            {isSpeaking
              ? (lang === 'en' ? 'Speaking...' : 'جَارٍ النُّطْقُ...')
              : (lang === 'en' ? 'Listen 🔊' : 'اِسْتَمِعْ لِلسَّاعَةِ 🔊')}
          </span>
        </button>
      </div>

      {/* Step Adjustment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Hours Stepper */}
        <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-2xl border-2 border-red-200">
          <button
            onClick={() => adjustHours(-1)}
            className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 1 hour' : 'إِنْقَاصُ سَاعَةٍ'}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-sm font-black text-red-950">{lang === 'en' ? 'Hour (±1)' : 'سَاعَةٌ (1±)'}</span>
          <button
            onClick={() => adjustHours(1)}
            className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 1 hour' : 'زِيَادَةُ سَاعَةٍ'}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 15 Minutes Stepper (Quarters) */}
        <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded-2xl border-2 border-blue-200">
          <button
            onClick={() => adjustMinutes(-15)}
            className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 15 minutes (Quarter)' : 'إِنْقَاصُ رُبْعِ سَاعَةٍ (15 د)'}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-sm font-black text-blue-950">{lang === 'en' ? '15 Min (±15)' : 'رُبْعُ سَاعَةٍ (15±)'}</span>
          <button
            onClick={() => adjustMinutes(15)}
            className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 15 minutes (Quarter)' : 'زِيَادَةُ رُبْعِ سَاعَةٍ (15 د)'}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Minutes Stepper */}
        <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-2xl border-2 border-emerald-200">
          <button
            onClick={() => adjustMinutes(-5)}
            className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 5 minutes' : 'إِنْقَاصُ 5 دَقَائِقَ'}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-sm font-black text-emerald-950">{lang === 'en' ? '5 Min (±5)' : '5 دَقَائِقَ (5±)'}</span>
          <button
            onClick={() => adjustMinutes(5)}
            className="w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 5 minutes' : 'زِيَادَةُ 5 دَقَائِقَ'}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 1 Minute Stepper */}
        <div className="flex items-center justify-between bg-purple-50 p-2.5 rounded-2xl border-2 border-purple-200">
          <button
            onClick={() => adjustMinutes(-1)}
            className="w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Decrease 1 minute' : 'إِنْقَاصُ دَقِيقَةٍ'}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-sm font-black text-purple-950">{lang === 'en' ? '1 Min (±1)' : 'دَقِيقَةٌ (1±)'}</span>
          <button
            onClick={() => adjustMinutes(1)}
            className="w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer"
            title={lang === 'en' ? 'Increase 1 minute' : 'زِيَادَةُ دَقِيقَةٍ'}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

