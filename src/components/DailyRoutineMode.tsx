import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatEnglishSpokenTime, formatDigitalTime } from '../utils/timeFormatters';
import { DailyRoutineItem, Language } from '../types';
import { Sun, School, Coffee, BookOpen, Home, Moon, Utensils, Award, Volume2 } from 'lucide-react';

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
  const [selectedId, setSelectedId] = useState<string>('school-start');
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const routineItems = lang === 'en' ? ROUTINE_ITEMS_EN : ROUTINE_ITEMS_AR;
  const selectedItem = routineItems.find((r) => r.id === selectedId) || routineItems[0];
  const digital = formatDigitalTime(selectedItem.defaultHours, selectedItem.defaultMinutes);
  
  const spoken = lang === 'en'
    ? formatEnglishSpokenTime(selectedItem.defaultHours, selectedItem.defaultMinutes, true)
    : formatArabicSpokenTime(selectedItem.defaultHours, selectedItem.defaultMinutes, true, false);

  const phoneticArabic = formatArabicSpokenTime(selectedItem.defaultHours, selectedItem.defaultMinutes, true, true);

  const handleSelect = (item: DailyRoutineItem) => {
    sounds.playClick();
    setSelectedId(item.id);
    if (!completedItems.includes(item.id)) {
      setCompletedItems((prev) => [...prev, item.id]);
      onEarnStar();
    }
    // Speak time and activity title in slow, friendly pace
    if (lang === 'en') {
      const speakText = `Time for ${item.title}. ${spoken}. ${item.description}`;
      sounds.speakEnglish(speakText);
    } else {
      const speakText = `وَقْتُ ${item.title}. السَّاعَةُ ${phoneticArabic}. ${item.description}`;
      sounds.speakArabic(speakText);
    }
  };

  const handleSpeakCurrent = () => {
    if (lang === 'en') {
      const speakText = `Time for ${selectedItem.title}. ${spoken}. ${selectedItem.description}`;
      sounds.speakEnglish(speakText);
    } else {
      const speakText = `وَقْتُ ${selectedItem.title}. السَّاعَةُ ${phoneticArabic}. ${selectedItem.description}`;
      sounds.speakArabic(speakText);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-orange-500" />;
      case 'School':
        return <School className="w-5 h-5 text-blue-500" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-emerald-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-indigo-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-500" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-purple-500" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Clock & Active Event Detail */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col items-center">
        <div className="w-full text-center pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
          <div className={lang === 'en' ? 'text-left' : 'text-right'}>
            <span className="text-sm font-black text-amber-800">
              {lang === 'en' ? 'The clock shows the time for:' : 'السَّاعَةُ تُشِيرُ إِلَى وَقْتِ:'}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-950 mt-0.5">{selectedItem.title}</h3>
          </div>
          <button
            onClick={handleSpeakCurrent}
            className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200 transition cursor-pointer active:scale-95 shrink-0"
            title={lang === 'en' ? 'Listen to spoken description' : 'اِسْتَمِعْ لِلْوَصْفِ صَوْتِيًّا'}
          >
            <Volume2 className="w-6 h-6 text-amber-600" />
          </button>
        </div>

        <InteractiveClock
          hours={selectedItem.defaultHours}
          minutes={selectedItem.defaultMinutes}
          interactive={false}
          showMinuteRing={true}
          showHandLabels={true}
          size={320}
          lang={lang}
        />

        {/* Event Time Summary Card */}
        <div className="w-full mt-4 p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-300 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-amber-950">
              {lang === 'en' ? 'Scheduled Time:' : 'الْوَقْتُ الْمُحَدَّدُ:'}
            </span>
            <span className="font-mono font-black text-base md:text-lg text-slate-950 bg-white px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-xs">
              {digital.time12} {lang === 'en' ? digital.period12En : (digital.isPm ? 'مَسَاءً' : 'صَبَاحًا')}
            </span>
          </div>

          <div className="text-lg md:text-xl font-black text-slate-950 leading-relaxed font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
            {spoken}
          </div>

          <p className="text-base text-slate-800 leading-relaxed pt-3 border-t border-amber-200/80 font-bold">
            {selectedItem.description}
          </p>
        </div>
      </div>

      {/* Right Column: Timeline Cards of the Day */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="font-black text-slate-950 text-lg">
              {lang === 'en' ? "Daily Routine Schedule:" : "جَدْوَلُ أَنْشِطَةِ يَوْمِ التِّلْمِيذِ:"}
            </h3>
          </div>
          <span className="text-sm font-black text-amber-900 bg-amber-50 border-2 border-amber-200 px-4 py-1.5 rounded-2xl">
            {lang === 'en'
              ? `Explored ${completedItems.length} of ${routineItems.length} activities`
              : `اِسْتَكْشَفْتَ ${completedItems.length} مِنْ ${routineItems.length} أَنْشِطَةٍ`}
          </span>
        </div>

        {/* List of Routine Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {routineItems.map((item) => {
            const isSelected = item.id === selectedId;
            const isViewed = completedItems.includes(item.id);
            const itemDig = formatDigitalTime(item.defaultHours, item.defaultMinutes);

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col gap-2.5 cursor-pointer active:scale-[0.99] shadow-2xs ${
                  lang === 'en' ? 'text-left' : 'text-right'
                } ${
                  isSelected
                    ? 'bg-amber-50/95 border-amber-500 shadow-md ring-2 ring-amber-200'
                    : isViewed
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-100">
                      {renderIcon(item.iconName)}
                    </div>
                    <span className="font-black text-base md:text-lg text-slate-950">
                      {item.title}
                    </span>
                  </div>

                  <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-900 border border-slate-200">
                    {itemDig.time12} {lang === 'en' ? itemDig.period12En : itemDig.period12}
                  </span>
                </div>

                <div className="text-sm text-slate-700 line-clamp-2 pr-1 font-bold leading-relaxed">
                  {item.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

