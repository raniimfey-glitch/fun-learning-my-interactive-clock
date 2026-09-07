import React from 'react';
import { Plus, Minus } from 'lucide-react';
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
  onChangeTime,
  lang = 'en' as Language,
}) => {
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

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex flex-col justify-center items-center flex-1 min-h-0 overflow-y-auto app-scrollable-card">
      {/* Grid of Stepper Controls with relatively reduced width */}
      <div className="w-full max-w-[440px] mx-auto grid grid-cols-2 gap-2 sm:gap-2.5 content-center">
        {/* 1. Hours Stepper (ساعة) */}
        <div className="flex items-center justify-between bg-red-50/90 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-red-200 shadow-2xs">
          <button
            onClick={() => adjustHours(-1)}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer border border-red-300/60 shrink-0"
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
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-black transition cursor-pointer border border-red-300/60 shrink-0"
            title={lang === 'en' ? 'Increase 1 hour' : 'زِيَادَةُ سَاعَةٍ (+1 س)'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Half Hour Stepper (نصف ساعة) */}
        <div className="flex items-center justify-between bg-amber-50/90 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-amber-200 shadow-2xs">
          <button
            onClick={() => adjustMinutes(-30)}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-800 flex items-center justify-center font-black transition cursor-pointer border border-amber-300/60 shrink-0"
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
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-800 flex items-center justify-center font-black transition cursor-pointer border border-amber-300/60 shrink-0"
            title={lang === 'en' ? 'Increase 30 mins' : 'زِيَادَةُ نِصْفِ سَاعَةٍ (+30 د)'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Quarter Hour Stepper (ربع ساعة) */}
        <div className="flex items-center justify-between bg-blue-50/90 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-blue-200 shadow-2xs">
          <button
            onClick={() => adjustMinutes(-15)}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer border border-blue-300/60 shrink-0"
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
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-700 flex items-center justify-center font-black transition cursor-pointer border border-blue-300/60 shrink-0"
            title={lang === 'en' ? 'Increase 15 mins' : 'زِيَادَةُ رُبْعِ سَاعَةٍ (+15 د)'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 4. 5 Minutes Stepper (5 دقائق) */}
        <div className="flex items-center justify-between bg-emerald-50/90 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-emerald-200 shadow-2xs">
          <button
            onClick={() => adjustMinutes(-5)}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer border border-emerald-300/60 shrink-0"
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
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-700 flex items-center justify-center font-black transition cursor-pointer border border-emerald-300/60 shrink-0"
            title={lang === 'en' ? 'Increase 5 mins' : 'زِيَادَةُ 5 دَقَائِقَ (+5 د)'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 5. 1 Minute Stepper (دقيقة) - centered at bottom */}
        <div className="flex items-center justify-between bg-purple-50/90 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-purple-200 shadow-2xs col-span-2 max-w-[214px] mx-auto w-full">
          <button
            onClick={() => adjustMinutes(-1)}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer border border-purple-300/60 shrink-0"
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
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-purple-700 flex items-center justify-center font-black transition cursor-pointer border border-purple-300/60 shrink-0"
            title={lang === 'en' ? 'Increase 1 min' : 'زِيَادَةُ دَقِيقَةٍ (+1 د)'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

