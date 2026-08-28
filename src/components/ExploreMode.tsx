import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { DigitalDisplay } from './DigitalDisplay';
import { ClockSettings, Language } from '../types';
import { Eye, Clock, Layers, Sparkles, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatEnglishSpokenTime } from '../utils/timeFormatters';

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
  const [selectedCategory, setSelectedCategory] = useState<'fractions' | 'daily' | 'hours'>('fractions');

  const fractionPresets = lang === 'en' ? [
    { label: "O'clock (:00)", h: 4, m: 0, desc: 'Blue minute hand points to 12' },
    { label: 'Quarter past (:15)', h: 4, m: 15, desc: 'Blue minute hand points to 3' },
    { label: 'Twenty past (:20)', h: 4, m: 20, desc: 'Blue minute hand points to 4' },
    { label: 'Half past (:30)', h: 4, m: 30, desc: 'Blue minute hand points to 6' },
    { label: 'Twenty to (:40)', h: 4, m: 40, desc: 'Blue minute hand points to 8' },
    { label: 'Quarter to (:45)', h: 4, m: 45, desc: 'Blue minute hand points to 9' },
  ] : [
    { label: 'تَمَامًا (:00)', h: 4, m: 0, desc: 'عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى 12' },
    { label: 'وَالرُّبْعُ (:15)', h: 4, m: 15, desc: 'عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى 3' },
    { label: 'وَالثُّلُثُ (:20)', h: 4, m: 20, desc: 'عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى 4' },
    { label: 'وَالنِّصْفُ (:30)', h: 4, m: 30, desc: 'عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى 6' },
    { label: 'إِلَّا ثُلُثًا (:40)', h: 4, m: 40, desc: 'عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى 8' },
    { label: 'إِلَّا رُبْعًا (:45)', h: 4, m: 45, desc: 'عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى 9' },
  ];

  const dailyPresets = lang === 'en' ? [
    { label: 'Wake Up 🌅', h: 6, m: 30, desc: '6:30 AM • Half past six' },
    { label: 'School Time 🏫', h: 8, m: 0, desc: '8:00 AM • Eight o’clock' },
    { label: 'Morning Snack 🥪', h: 10, m: 15, desc: '10:15 AM • Quarter past ten' },
    { label: 'Lunch Time 🍽️', h: 12, m: 30, desc: '12:30 PM • Half past twelve' },
    { label: 'Homework Time 🎒', h: 16, m: 30, desc: '4:30 PM • Half past four' },
    { label: 'Bedtime 🌙', h: 20, m: 45, desc: '8:45 PM • Quarter to nine' },
  ] : [
    { label: 'الِاسْتِيقَاظُ 🌅', h: 6, m: 30, desc: 'السَّادِسَةُ وَالنِّصْفُ صَبَاحًا' },
    { label: 'بِدَايَةُ الدَّوَامِ 🏫', h: 8, m: 0, desc: 'الثَّامِنَةُ تَمَامًا صَبَاحًا' },
    { label: 'اسْتِرَاحَةُ اللُّمْجَةِ 🥪', h: 10, m: 15, desc: 'الْعَاشِرَةُ وَالرُّبْعُ صَبَاحًا' },
    { label: 'وَجْبَةُ الْغَدَاءِ 🍽️', h: 12, m: 30, desc: 'الثَّانِيَةَ عَشْرَةَ وَالنِّصْفُ ظُهْرًا' },
    { label: 'أَدَاءُ الْوَاجِبَاتِ 🎒', h: 16, m: 30, desc: 'الرَّابِعَةُ وَالنِّصْفُ مَسَاءً' },
    { label: 'النَّوْمُ الْمُبَكِّرُ 🌙', h: 20, m: 45, desc: 'التَّاسِعَةُ إِلَّا رُبْعًا لَيْلًا' },
  ];

  const hourPresets = [
    { label: '1:00', h: 1, m: 0 },
    { label: '2:00', h: 2, m: 0 },
    { label: '3:00', h: 3, m: 0 },
    { label: '4:00', h: 4, m: 0 },
    { label: '5:00', h: 5, m: 0 },
    { label: '6:00', h: 6, m: 0 },
    { label: '7:00', h: 7, m: 0 },
    { label: '8:00', h: 8, m: 0 },
    { label: '9:00', h: 9, m: 0 },
    { label: '10:00', h: 10, m: 0 },
    { label: '11:00', h: 11, m: 0 },
    { label: '12:00', h: 12, m: 0 },
  ];

  const applyPreset = (h: number, m: number) => {
    sounds.playClick();
    if (settings.isLiveTime) {
      onUpdateSettings({ isLiveTime: false });
    }
    onChangeTime(h, m);
    // Speak time automatically for clear pronunciation
    if (lang === 'en') {
      const spoken = formatEnglishSpokenTime(h, m, true);
      sounds.speakEnglish(spoken);
    } else {
      const spoken = formatArabicSpokenTime(h, m, true, true);
      sounds.speakArabic(spoken);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: The Interactive Clock Face */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-col items-center">
        {/* Helper Note for Kids */}
        <div className="w-full flex items-center justify-between text-sm font-black text-slate-700 mb-2 px-1 flex-wrap gap-2">
          <span className="flex items-center gap-2 text-amber-800">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>
              {lang === 'en'
                ? 'Drag the hands with your finger or mouse:'
                : 'حَرِّكِ الْعَقَارِبَ مُبَاشَرَةً بِإِصْبَعِكَ أَوْ بِالْفَأْرَةِ:'}
            </span>
          </span>
          {settings.isLiveTime && (
            <span className="bg-emerald-100 text-emerald-900 text-xs md:text-sm px-3 py-1 rounded-full font-black animate-pulse border border-emerald-300">
              {lang === 'en' ? 'LIVE CLOCK 🔴' : 'سَاعَةٌ حَيَّةٌ الْآنَ 🔴'}
            </span>
          )}
        </div>

        {/* The Clock Component */}
        <InteractiveClock
          hours={hours}
          minutes={minutes}
          seconds={settings.isLiveTime ? seconds : undefined}
          interactive={!settings.isLiveTime}
          onChangeTime={onChangeTime}
          showMinuteRing={settings.showMinuteNumbers}
          showFractionsOverlay={settings.showFractionsOverlay}
          showHandLabels={settings.showHandNames}
          size={340}
          lang={lang}
        />

        {/* Visual Layer Toggles */}
        <div className="w-full mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm font-black text-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ showMinuteNumbers: !settings.showMinuteNumbers });
            }}
            className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-2xs ${
              settings.showMinuteNumbers
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>{lang === 'en' ? 'Minute Ring (:05-:55)' : 'أَرْقَامُ الدَّقَائِقِ (:05-:55)'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ showFractionsOverlay: !settings.showFractionsOverlay });
            }}
            className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-2xs ${
              settings.showFractionsOverlay
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>{lang === 'en' ? 'Fraction Colors' : 'أَلْوَانُ الْأَرْبَاعِ وَالْأَنْصَافِ'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onUpdateSettings({ isLiveTime: !settings.isLiveTime });
            }}
            className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition col-span-2 sm:col-span-1 cursor-pointer active:scale-95 shadow-2xs ${
              settings.isLiveTime
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              {settings.isLiveTime
                ? (lang === 'en' ? 'Stop Live Clock' : 'إِيقَافُ الْوَقْتِ الْفِعْلِيِّ')
                : (lang === 'en' ? 'Live Current Time' : 'الْوَقْتُ الْحَقِيقِيُّ الْآنَ')}
            </span>
          </button>
        </div>
      </div>

      {/* Right Column: Digital Display & Quick Presets */}
      <div className="w-full lg:flex-1 flex flex-col gap-5">
        <DigitalDisplay
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          onChangeTime={onChangeTime}
          lang={lang}
        />

        {/* Quick Presets / Learning Cards */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 flex-wrap">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <span>
                {lang === 'en'
                  ? 'Common Time Presets to Explore & Hear:'
                  : 'أَوْقَاتٌ نَمُوذَجِيَّةٌ لِلتَّجْرِبَةِ وَالِاسْتِمَاعِ:'}
              </span>
            </h3>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-sm font-black flex-wrap">
              <button
                onClick={() => setSelectedCategory('fractions')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  selectedCategory === 'fractions'
                    ? 'bg-white text-amber-900 shadow-xs font-black'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {lang === 'en' ? 'Fractions (Quarter/Half)' : 'أَجْزَاءُ السَّاعَةِ (الرُّبْعُ/النِّصْفُ)'}
              </button>
              <button
                onClick={() => setSelectedCategory('daily')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  selectedCategory === 'daily'
                    ? 'bg-white text-amber-900 shadow-xs font-black'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {lang === 'en' ? 'Daily Routine' : 'أَوْقَاتُ الْيَوْمِ الْمَدْرَسِيِّ'}
              </button>
              <button
                onClick={() => setSelectedCategory('hours')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  selectedCategory === 'hours'
                    ? 'bg-white text-amber-900 shadow-xs font-black'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {lang === 'en' ? "O'clock (:00)" : 'السَّاعَاتُ التَّامَّةُ (:00)'}
              </button>
            </div>
          </div>

          {/* Preset Buttons Grid */}
          {selectedCategory === 'fractions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fractionPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(item.h, item.m)}
                  className={`p-4 rounded-2xl bg-amber-50/80 hover:bg-amber-100 border-2 border-amber-200 transition flex flex-col gap-1.5 group active:scale-95 cursor-pointer shadow-2xs ${
                    lang === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base md:text-lg group-hover:text-amber-900">
                      {item.label}
                    </span>
                    <Volume2 className="w-5 h-5 text-amber-600 opacity-70 group-hover:opacity-100" />
                  </div>
                  <span className="text-sm text-slate-700 font-bold">{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'daily' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dailyPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(item.h, item.m)}
                  className={`p-4 rounded-2xl bg-sky-50/80 hover:bg-sky-100 border-2 border-sky-200 transition flex flex-col gap-1.5 group active:scale-95 cursor-pointer shadow-2xs ${
                    lang === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base md:text-lg group-hover:text-sky-900">
                      {item.label}
                    </span>
                    <Volume2 className="w-5 h-5 text-sky-600 opacity-70 group-hover:opacity-100" />
                  </div>
                  <span className="text-sm text-slate-700 font-bold">{item.desc}</span>
                </button>
              ))}
            </div>
          )}

          {selectedCategory === 'hours' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {hourPresets.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(item.h, item.m)}
                  className="py-3.5 px-4 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border-2 border-slate-200 text-center font-black text-base text-slate-900 hover:text-amber-900 transition active:scale-95 cursor-pointer flex items-center justify-between shadow-2xs"
                >
                  <span>{lang === 'en' ? `${item.label} o'clock` : `السَّاعَةُ ${item.label}`}</span>
                  <Volume2 className="w-4 h-4 text-amber-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

