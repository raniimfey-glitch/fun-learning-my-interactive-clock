import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatEnglishSpokenTime, formatDigitalTime } from '../utils/timeFormatters';
import { DailyRoutineItem, Language } from '../types';
import { Sun, School, Coffee, BookOpen, Home, Moon, Utensils, Award, Volume2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface DailyRoutineModeProps {
  onEarnStar: () => void;
  lang?: Language;
}

const ROUTINE_ITEMS_AR: DailyRoutineItem[] = [
  {
    id: 'wake',
    title: 'الِاسْتِيقَاظُ وَالنَّشَاطُ',
    description: 'أَسْتَيْقِظُ مُبَكِّرًا بِنَشَاطٍ، وَأَغْسِلُ وَجْهِي وَأَسْنَانِي، وَأُرَتِّبُ سَرِيرِي.',
    spokenDescription: 'أَسْتَيْقِظُ مُبَكِّرًا بِنَشَاطٍ، وَأَغْسِلُ وَجْهِي وَأَسْنَانِي، وَأُرَتِّبُ سَرِيرِي.',
    defaultHours: 6,
    defaultMinutes: 30,
    period: 'morning',
    iconName: 'Sun',
  },
  {
    id: 'breakfast',
    title: 'وَجْبَةُ الْفُطُورِ',
    description: 'أَتَنَاوَلُ فُطُورِي الصِّحِّيَّ مَعَ الْحَلِيبِ لِأَكُونَ قَوِيًّا وَذَكِيًّا فِي الْمَدْرَسَةِ.',
    spokenDescription: 'أَتَنَاوَلُ فُطُورِي الصِّحِّيَّ مَعَ الْحَلِيبِ لِأَكُونَ قَوِيًّا وَذَكِيًّا فِي الْمَدْرَسَةِ.',
    defaultHours: 7,
    defaultMinutes: 15,
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'school-start',
    title: 'بِدَايَةُ الدُّرُوسِ الصَّبَاحِيَّةِ',
    description: 'أَصِلُ إِلَى الْمَدْرَسَةِ بِنَشَاطٍ، وَأَقِفُ فِي الطَّابُورِ ثُمَّ أَدْخُلُ الْقِسْمَ.',
    spokenDescription: 'أَصِلُ إِلَى الْمَدْرَسَةِ بِنَشَاطٍ، وَأَقِفُ فِي الطَّابُورِ ثُمَّ أَدْخُلُ الْقِسْمَ.',
    defaultHours: 8,
    defaultMinutes: 0,
    period: 'morning',
    iconName: 'School',
  },
  {
    id: 'recess',
    title: 'اسْتِرَاحَةُ اللُّمْجَةِ وَاللَّعِبِ',
    description: 'أَتَنَاوَلُ لُمْجَتِي اللَّذِيذَةَ وَأَلْعَبُ مَعَ زُمَلَائِي فِي سَاحَةِ الْمَدْرَسَةِ.',
    spokenDescription: 'أَتَنَاوَلُ لُمْجَتِي اللَّذِيذَةَ وَأَلْعَبُ مَعَ زُمَلَائِي فِي سَاحَةِ الْمَدْرَسَةِ.',
    defaultHours: 10,
    defaultMinutes: 15,
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'lunch',
    title: 'وَجْبَةُ الْغَدَاءِ',
    description: 'أَتَنَاوَلُ طَعَامَ الْغَدَاءِ اللَّذِيذَ مَعَ الْعَائِلَةِ فِي مُنْتَصَفِ النَّهَارِ.',
    spokenDescription: 'أَتَنَاوَلُ طَعَامَ الْغَدَاءِ اللَّذِيذَ مَعَ الْعَائِلَةِ فِي مُنْتَصَفِ النَّهَارِ.',
    defaultHours: 12,
    defaultMinutes: 30,
    period: 'afternoon',
    iconName: 'Utensils',
  },
  {
    id: 'school-end',
    title: 'الْعَوْدَةُ إِلَى الْمَنْزِلِ',
    description: 'أَجْمَعُ أَدَوَاتِي وَأَعُودُ إِلَى الْبَيْتِ سَعِيدًا بِمَا تَعَلَّمْتُهُ الْيَوْمَ.',
    spokenDescription: 'أَجْمَعُ أَدَوَاتِي وَأَعُودُ إِلَى الْبَيْتِ سَعِيدًا بِمَا تَعَلَّمْتُهُ الْيَوْمَ.',
    defaultHours: 15,
    defaultMinutes: 30,
    period: 'afternoon',
    iconName: 'Home',
  },
  {
    id: 'homework',
    title: 'حَلُّ الْوَاجِبَاتِ وَالْمُطَالَعَةُ',
    description: 'أُرَاجِعُ دُرُوسِي وَأَحُلُّ وَاجِبَاتِي الْمَدْرَسِيَّةَ ثُمَّ أَقْرَأُ قِصَّةً شَيِّقَةً.',
    spokenDescription: 'أُرَاجِعُ دُرُوسِي وَأَحُلُّ وَاجِبَاتِي الْمَدْرَسِيَّةَ ثُمَّ أَقْرَأُ قِصَّةً شَيِّقَةً.',
    defaultHours: 17,
    defaultMinutes: 0,
    period: 'evening',
    iconName: 'BookOpen',
  },
  {
    id: 'dinner',
    title: 'الْعَشَاءُ مَعَ الْعَائِلَةِ',
    description: 'أَجْلِسُ مَعَ أُسْرَتِي لِتَنَاوُلِ الْعَشَاءِ وَنَتَبَادَلُ الْحَدِيثَ الْمُمْتِعَ.',
    spokenDescription: 'أَجْلِسُ مَعَ أُسْرَتِي لِتَنَاوُلِ الْعَشَاءِ وَنَتَبَادَلُ الْحَدِيثَ الْمُمْتِعَ.',
    defaultHours: 19,
    defaultMinutes: 30,
    period: 'evening',
    iconName: 'Utensils',
  },
  {
    id: 'sleep',
    title: 'النَّوْمُ الْمُبَكِّرُ',
    description: 'أُنَظِّفُ أَسْنَانِي وَأَنَامُ مُبَكِّرًا لِأَسْتَيْقِظَ نَشِيطًا فِي الصَّبَاحِ الْبَاكِرِ.',
    spokenDescription: 'أُنَظِّفُ أَسْنَانِي وَأَنَامُ مُبَكِّرًا لِأَسْتَيْقِظَ نَشِيطًا فِي الصَّبَاحِ الْبَاكِرِ.',
    defaultHours: 20,
    defaultMinutes: 45,
    period: 'night',
    iconName: 'Moon',
  },
];

const ROUTINE_ITEMS_EN: DailyRoutineItem[] = [
  {
    id: 'wake',
    title: 'Wake Up & Shine',
    description: 'I wake up early full of energy, brush my teeth, and make my bed.',
    spokenDescription: 'I wake up early full of energy, brush my teeth, and make my bed.',
    defaultHours: 6,
    defaultMinutes: 30,
    period: 'morning',
    iconName: 'Sun',
  },
  {
    id: 'breakfast',
    title: 'Healthy Breakfast',
    description: 'I eat a nutritious breakfast with milk to stay sharp and energized for school.',
    spokenDescription: 'I eat a nutritious breakfast with milk to stay sharp and energized for school.',
    defaultHours: 7,
    defaultMinutes: 15,
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'school-start',
    title: 'School Lessons Begin',
    description: 'I arrive at school cheerfully, greet my teacher, and get ready to learn.',
    spokenDescription: 'I arrive at school cheerfully, greet my teacher, and get ready to learn.',
    defaultHours: 8,
    defaultMinutes: 0,
    period: 'morning',
    iconName: 'School',
  },
  {
    id: 'recess',
    title: 'Snack & Recess',
    description: 'I eat my delicious snack and enjoy playing fun games with classmates in the yard.',
    spokenDescription: 'I eat my delicious snack and enjoy playing fun games with classmates in the yard.',
    defaultHours: 10,
    defaultMinutes: 15,
    period: 'morning',
    iconName: 'Coffee',
  },
  {
    id: 'lunch',
    title: 'Lunch Break',
    description: 'I enjoy a wholesome, yummy lunch with family and friends at midday.',
    spokenDescription: 'I enjoy a wholesome, yummy lunch with family and friends at midday.',
    defaultHours: 12,
    defaultMinutes: 30,
    period: 'afternoon',
    iconName: 'Utensils',
  },
  {
    id: 'school-end',
    title: 'Heading Home',
    description: 'I pack up my bag and head home happily with everything I learned today.',
    spokenDescription: 'I pack up my bag and head home happily with everything I learned today.',
    defaultHours: 15,
    defaultMinutes: 30,
    period: 'afternoon',
    iconName: 'Home',
  },
  {
    id: 'homework',
    title: 'Homework & Reading',
    description: 'I review my daily lessons, complete my homework, and read an exciting story.',
    spokenDescription: 'I review my daily lessons, complete my homework, and read an exciting story.',
    defaultHours: 17,
    defaultMinutes: 0,
    period: 'evening',
    iconName: 'BookOpen',
  },
  {
    id: 'dinner',
    title: 'Family Dinner',
    description: 'I gather around the table with my family for dinner and cheerful conversations.',
    spokenDescription: 'I gather around the table with my family for dinner and cheerful conversations.',
    defaultHours: 19,
    defaultMinutes: 30,
    period: 'evening',
    iconName: 'Utensils',
  },
  {
    id: 'sleep',
    title: 'Early Bedtime',
    description: 'I brush my teeth, put on cozy pajamas, and go to sleep early to wake up happy.',
    spokenDescription: 'I brush my teeth, put on cozy pajamas, and go to sleep early to wake up happy.',
    defaultHours: 20,
    defaultMinutes: 45,
    period: 'night',
    iconName: 'Moon',
  },
];

export const DailyRoutineMode: React.FC<DailyRoutineModeProps> = ({ onEarnStar, lang = 'en' }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const routineItems = lang === 'en' ? ROUTINE_ITEMS_EN : ROUTINE_ITEMS_AR;
  const currentItem = routineItems[currentIndex] || routineItems[0];
  const digital = formatDigitalTime(currentItem.defaultHours, currentItem.defaultMinutes);
  
  const spoken = lang === 'en'
    ? formatEnglishSpokenTime(currentItem.defaultHours, currentItem.defaultMinutes, true)
    : formatArabicSpokenTime(currentItem.defaultHours, currentItem.defaultMinutes, true, false);

  const phoneticArabic = formatArabicSpokenTime(currentItem.defaultHours, currentItem.defaultMinutes, true, true);

  const handleNext = () => {
    sounds.playClick();
    const nextIndex = (currentIndex + 1) % routineItems.length;
    setCurrentIndex(nextIndex);
    const item = routineItems[nextIndex];
    if (!completedItems.includes(item.id)) {
      setCompletedItems((prev) => [...prev, item.id]);
      onEarnStar();
    }
    // Speak time and activity title in slow, friendly pace
    if (lang === 'en') {
      const itemSpoken = formatEnglishSpokenTime(item.defaultHours, item.defaultMinutes, true);
      const speakText = `Time for ${item.title}. ${itemSpoken}. ${item.description}`;
      sounds.speakEnglish(speakText);
    } else {
      const itemPhoneticArabic = formatArabicSpokenTime(item.defaultHours, item.defaultMinutes, true, true);
      const speakText = `وَقْتُ ${item.title}. ${itemPhoneticArabic}. ${item.description}`;
      sounds.speakArabic(speakText);
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    const prevIndex = (currentIndex - 1 + routineItems.length) % routineItems.length;
    setCurrentIndex(prevIndex);
    const item = routineItems[prevIndex];
    if (lang === 'en') {
      const itemSpoken = formatEnglishSpokenTime(item.defaultHours, item.defaultMinutes, true);
      const speakText = `Time for ${item.title}. ${itemSpoken}. ${item.description}`;
      sounds.speakEnglish(speakText);
    } else {
      const itemPhoneticArabic = formatArabicSpokenTime(item.defaultHours, item.defaultMinutes, true, true);
      const speakText = `وَقْتُ ${item.title}. ${itemPhoneticArabic}. ${item.description}`;
      sounds.speakArabic(speakText);
    }
  };

  const handleSpeakCurrent = () => {
    if (lang === 'en') {
      const speakText = `Time for ${currentItem.title}. ${spoken}. ${currentItem.description}`;
      sounds.speakEnglish(speakText);
    } else {
      const speakText = `وَقْتُ ${currentItem.title}. ${phoneticArabic}. ${currentItem.description}`;
      sounds.speakArabic(speakText);
    }
  };

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'Coffee':
        return <Coffee className={`${className} text-orange-500`} />;
      case 'School':
        return <School className={`${className} text-blue-500`} />;
      case 'Utensils':
        return <Utensils className={`${className} text-emerald-500`} />;
      case 'Home':
        return <Home className={`${className} text-indigo-500`} />;
      case 'BookOpen':
        return <BookOpen className={`${className} text-rose-500`} />;
      case 'Moon':
        return <Moon className={`${className} text-purple-500`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="app-game-card w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-2.5 sm:gap-3.5 items-stretch overflow-hidden">
      {/* Left Column: Clock Face */}
      <div className="w-full lg:w-[420px] bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between shrink-0 overflow-hidden">
        <div className="w-full pb-2 border-b border-slate-100 mb-1 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 border border-amber-200">
              {renderIcon(currentItem.iconName, "w-5 h-5")}
            </div>
            <div className={lang === 'en' ? 'text-left' : 'text-right'}>
              <span className="text-xs font-black text-amber-800">
                {lang === 'en' ? 'Activity Time:' : 'وَقْتُ النَّشَاطِ:'}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-950 truncate max-w-[200px]">
                {currentItem.title}
              </h3>
            </div>
          </div>

          <span className="font-mono font-black text-xs sm:text-sm text-slate-950 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
            {digital.time12} {lang === 'en' ? digital.period12En : (digital.isPm ? 'مَسَاءً' : 'صَبَاحًا')}
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden py-1">
          <InteractiveClock
            hours={currentItem.defaultHours}
            minutes={currentItem.defaultMinutes}
            interactive={false}
            showMinuteRing={true}
            showHandLabels={false}
            size={360}
            lang={lang}
          />
        </div>
      </div>

      {/* Right Column: Active Routine Card with Next Navigation */}
      <div className="w-full lg:flex-1 min-h-0 flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs border border-slate-200/80 overflow-y-auto app-scrollable-card gap-3">
        {/* Header: Progress & Step Counter */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
              {lang === 'en'
                ? `Activity ${currentIndex + 1} of ${routineItems.length}`
                : `النَّشَاطُ ${currentIndex + 1} مِنْ ${routineItems.length}`}
            </span>
            {completedItems.includes(currentItem.id) && (
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'en' ? 'Completed' : 'مُكْتَمَلٌ'}</span>
              </span>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {routineItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex(idx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2.5 bg-amber-500 rounded-full'
                    : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                }`}
                title={item.title}
              />
            ))}
          </div>
        </div>

        {/* Activity Details Box */}
        <div className="flex-1 flex flex-col justify-center gap-3 py-1">
          {/* Title & Large Icon */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 shrink-0">
              {renderIcon(currentItem.iconName, "w-8 h-8 sm:w-10 sm:h-10")}
            </div>
            <div>
              <div className="text-xs font-black text-amber-800 mb-0.5">
                {lang === 'en' ? 'Current Routine:' : 'النَّشَاطُ الْيَوْمِيُّ لِلتِّلْمِيذِ:'}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950">
                {currentItem.title}
              </h2>
            </div>
          </div>

          {/* Spoken Time Banner */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className={`flex-1 text-center ${lang === 'en' ? 'sm:text-left' : 'sm:text-right'}`}>
              <div className="text-xs font-black text-amber-900 mb-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'en' ? 'SAY AND READ THE TIME:' : 'قِرَاءَةُ وَنُطْقُ السَّاعَةِ (مُشَكَّلَةٌ):'}</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 leading-relaxed font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
                {spoken}
              </div>
            </div>

            <button
              onClick={handleSpeakCurrent}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-black transition shadow-xs active:scale-95 shrink-0 cursor-pointer"
              title={lang === 'en' ? 'Listen to activity description' : 'اسْتَمِعْ لِلنَّشَاطِ صَوْتِيًّا'}
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Listen 🔊' : 'اسْتَمِعْ 🔊'}</span>
            </button>
          </div>

          {/* Detailed Story / Routine Description */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4">
            <div className="text-xs font-black text-slate-500 mb-1">
              {lang === 'en' ? 'WHAT THE STUDENT DOES:' : 'مَاذَا يَفْعَلُ التِّلْمِيذُ فِي هَذَا الْوَقْتِ:'}
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
              {currentItem.description}
            </p>
          </div>
        </div>

        {/* Bottom Navigation Buttons: Previous & Next Activity */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrev}
            className="py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            title={lang === 'en' ? 'Previous Activity' : 'الرُّجُوعُ لِلنَّشَاطِ السَّابِقِ'}
          >
            {lang === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            <span>{lang === 'en' ? 'Previous' : 'السَّابِقُ'}</span>
          </button>

          <button
            id="next-routine-activity-btn"
            onClick={handleNext}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {currentIndex === routineItems.length - 1
                ? (lang === 'en' ? 'Restart Routine 🔄' : 'إِعَادَةُ الدَّوْرَةِ الْيَوْمِيَّةِ 🔄')
                : (lang === 'en' ? 'Next Activity' : 'النَّشَاطُ التَّالِي')}
            </span>
            {lang === 'en' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

