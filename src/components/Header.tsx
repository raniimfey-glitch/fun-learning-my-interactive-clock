import React from 'react';
import { AppMode, Language } from '../types';
import { Clock, Gamepad2, HelpCircle, Calendar, BookOpen, Award, Volume2, VolumeX, Star, Languages, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  starsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGuide: () => void;
  onOpenCertificate: () => void;
  onOpenSplash?: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  starsCount,
  soundEnabled,
  onToggleSound,
  onOpenGuide,
  onOpenCertificate,
  onOpenSplash,
  lang,
  onToggleLang,
}) => {
  const modes: { id: AppMode; labelAr: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'explore', labelAr: 'اِسْتَكْشِفْ وَتَعَلَّمْ', labelEn: 'Explore & Learn', icon: Clock },
    { id: 'set-clock', labelAr: 'لُعْبَةُ: اِضْبُطِ السَّاعَةَ', labelEn: 'Set the Clock', icon: Gamepad2 },
    { id: 'quiz', labelAr: 'مُسَابَقَةُ: كَمِ السَّاعَةُ؟', labelEn: 'Clock Quiz', icon: HelpCircle },
    { id: 'routine', labelAr: 'أَوْقَاتِي الْيَوْمِيَّةُ', labelEn: 'Daily Routine', icon: Calendar },
  ];

  const handleSpeakWelcome = () => {
    if (lang === 'en') {
      sounds.speakEnglish('Welcome to the Interactive Clock for Grade 2! Let us explore and learn how to tell time together.');
    } else {
      sounds.speakArabic('مَرْحَبًا بِكَ فِي دَرْسِ السَّاعَةِ لِلسَّنَةِ الثَّانِيَةِ ابْتِدَائِيٍّ! هَيَّا نَتَعَلَّمْ قِرَاءَةَ السَّاعَةِ مَعًا.');
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col gap-3.5">
        {/* Top bar: Title, Badge, Star Counter & Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={handleSpeakWelcome}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25 hover:scale-105 active:scale-95 transition cursor-pointer"
              title={lang === 'en' ? 'Click to listen to voice greeting' : 'اِضْغَطْ لِلاسْتِمَاعِ إِلَى التَّرْحِيبِ الصَّوْتِيِّ'}
            >
              <Clock className="w-7 h-7 animate-pulse" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none flex items-center gap-2.5 flex-wrap">
                <span>{lang === 'en' ? 'My Interactive Clock' : 'سَاعَتِي التَّفَاعُلِيَّةُ'}</span>
                <span className="text-sm md:text-base font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {lang === 'en' ? 'Grade 2 Primary' : 'السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ'}
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-600 font-bold mt-1 flex items-center gap-1">
                <span>
                  {lang === 'en'
                    ? 'Learn to tell time and set clock hands with clear, friendly voice narration'
                    : 'تَعَلَّمْ قِرَاءَةَ وَضَبْطَ عَقَارِبِ السَّاعَةِ صَوْتِيًّا بِنُطْقٍ عَرَبِيٍّ سَلِيمٍ وَمُمْتِعٍ'}
                </span>
              </p>
            </div>
          </div>

          {/* Right Action Tools: Language, Guide, Certificate, Sound, Stars */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Switcher */}
            <button
              onClick={() => {
                sounds.playClick();
                onToggleLang();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 text-sm font-black transition shadow-xs cursor-pointer active:scale-95"
              title="تَغْيِيرُ اللُّغَةِ / Switch Language"
            >
              <Languages className="w-4 h-4 text-amber-600" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Guide Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenGuide();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 border-2 border-blue-200 text-sm font-black transition shadow-xs cursor-pointer active:scale-95"
              title={lang === 'en' ? 'Illustrated Lesson Guide' : 'دَلِيلُ الدَّرْسِ الْمُصَوَّرُ'}
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>{lang === 'en' ? 'Lesson Guide' : 'دَلِيلُ الدَّرْسِ'}</span>
            </button>

            {/* Certificate Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCertificate();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200 text-sm font-black transition shadow-xs cursor-pointer active:scale-95"
              title={lang === 'en' ? 'Achievement & Certificate' : 'لَوْحَةُ الْإِنْجَازِ وَالشَّهَادَةِ'}
            >
              <Award className="w-5 h-5 text-amber-600" />
              <span>{lang === 'en' ? 'Certificate' : 'لَوْحَةُ الْإِنْجَازِ'}</span>
            </button>

            {/* Welcome / Splash Screen Button */}
            {onOpenSplash && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenSplash();
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border-2 border-amber-300 text-sm font-black transition shadow-xs cursor-pointer active:scale-95"
                title={lang === 'en' ? 'Welcome / Splash Screen' : 'شَاشَةُ التَّرْحِيبِ'}
              >
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
                <span>{lang === 'en' ? 'Welcome' : 'شَاشَةُ التَّرْحِيبِ'}</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
              }}
              className={`p-2.5 rounded-2xl border-2 transition cursor-pointer active:scale-95 ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
              title={soundEnabled ? (lang === 'en' ? 'Mute sound' : 'كَتْمُ الصَّوْتِ') : (lang === 'en' ? 'Enable sound' : 'تَشْغِيلُ الصَّوْتِ')}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Stars Counter */}
            <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-2xl shadow-sm text-sm md:text-base font-black border border-amber-600">
              <Star className="w-5 h-5 fill-white text-white animate-bounce" />
              <span>
                {lang === 'en'
                  ? `${starsCount} ${starsCount === 1 ? 'Star' : 'Stars'}`
                  : `${starsCount} ${starsCount === 1 ? 'نَجْمَةٌ' : starsCount === 2 ? 'نَجْمَتَانِ' : starsCount <= 10 ? 'نُجُومٍ' : 'نَجْمَةً'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectMode(mode.id);
                }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm md:text-base transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{lang === 'en' ? mode.labelEn : mode.labelAr}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

