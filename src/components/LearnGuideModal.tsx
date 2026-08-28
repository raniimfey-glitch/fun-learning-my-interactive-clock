import React, { useState } from 'react';
import { X, BookOpen, Clock, PieChart, Layers, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { Language } from '../types';

interface LearnGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const LearnGuideModal: React.FC<LearnGuideModalProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'hands' | 'basic' | 'fractions' | 'multiples'>('hands');

  if (!isOpen) return null;

  const handleSpeakTab = (textAr: string, textEn: string) => {
    if (lang === 'en') {
      sounds.speakEnglish(textEn);
    } else {
      sounds.speakArabic(textAr);
    }
  };

  const tabs = [
    { id: 'hands', labelAr: '1. عَقَارِبُ السَّاعَةِ', labelEn: '1. Clock Hands', icon: Clock },
    { id: 'basic', labelAr: '2. تَمَامًا (:00) وَالنِّصْفُ (:30)', labelEn: "2. O'clock & Half Past", icon: Layers },
    { id: 'fractions', labelAr: '3. الرُّبْعُ (:15) وَإِلَّا رُبْعًا (:45)', labelEn: '3. Quarter Past & To', icon: PieChart },
    { id: 'multiples', labelAr: '4. قِرَاءَةُ الدَّقَائِقِ (5 فِي 5)', labelEn: '4. Count by 5 Minutes', icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 md:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/20">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black">
                {lang === 'en' ? 'Time Lesson Guide (Grade 2 Primary) 📖' : 'دَلِيلُ دَرْسِ السَّاعَةِ (السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ) 📖'}
              </h2>
              <p className="text-sm text-amber-100 font-bold mt-0.5">
                {lang === 'en'
                  ? 'Simple illustrated lessons with gentle, clear voice narration'
                  : 'شَرْحٌ مُبَسَّطٌ وَمُصَوَّرٌ مَعَ الْقِرَاءَةِ الصَّوْتِيَّةِ الْوَاضِحَةِ'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Guide Navigation Tabs */}
        <div className="flex items-center gap-2 p-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm md:text-base font-black transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{lang === 'en' ? tab.labelEn : tab.labelAr}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800">
          {activeTab === 'hands' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                  {lang === 'en' ? 'What are the Clock Hands?' : 'مَا هِيَ عَقَارِبُ السَّاعَةِ ذَاتِ الْأَرْقَامِ؟'}
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'تَتَكَوَّنُ السَّاعَةُ مِنْ عَقْرَبَيْنِ رَئِيسِيَّيْنِ: عَقْرَبُ السَّاعَاتِ الْقَصِيرُ بِاللَّوْنِ الْأَحْمَرِ، وَعَقْرَبُ الدَّقَائِقِ الطَّوِيلُ بِاللَّوْنِ الْأَزْرَقِ.',
                      'The clock has two main hands: the short red hand tells the hour, and the long blue hand tells the minutes.'
                    )
                  }
                  className="flex items-center gap-2 text-sm font-black text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-200 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'en' ? 'Listen to Lesson 🔊' : 'اِسْتَمِعْ لِلشَّرْحِ 🔊'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-red-50 border-2 border-red-200 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-red-900 font-black text-lg">
                    <span className="w-4 h-4 rounded-full bg-red-600"></span>
                    <span>{lang === 'en' ? '1. Short Hand (Hour - Red)' : '1. عَقْرَبُ السَّاعَاتِ (الْقَصِيرُ - أَحْمَرُ)'}</span>
                  </div>
                  <p className="text-base text-slate-800 leading-relaxed font-bold">
                    {lang === 'en'
                      ? 'This is the shorter, thicker hand. It points to the current hour (e.g. 1, 2, 3...). It moves slowly around the clock.'
                      : 'هُوَ الْعَقْرَبُ الْأَقْصَرُ وَالْأَسْمَكُ، وَيُشِيرُ إِلَى رَقْمِ السَّاعَةِ الْحَالِيَّةِ (مِثْلًا: 1، 2، 3...). يَتَحَرَّكُ بِبُطْءٍ وَيَدُلُّ عَلَى السَّاعَةِ.'}
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-blue-50 border-2 border-blue-200 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-blue-900 font-black text-lg">
                    <span className="w-4 h-4 rounded-full bg-blue-600"></span>
                    <span>{lang === 'en' ? '2. Long Hand (Minute - Blue)' : '2. عَقْرَبُ الدَّقَائِقِ (الطَّوِيلُ - أَزْرَقُ)'}</span>
                  </div>
                  <p className="text-base text-slate-800 leading-relaxed font-bold">
                    {lang === 'en'
                      ? "This is the longer hand. It points to the minutes. When it points at 12, it is o'clock. When it points at 6, it is half past."
                      : 'هُوَ الْعَقْرَبُ الْأَطْوَلُ وَالْأَنْحَفُ، وَيُشِيرُ إِلَى عَدَدِ الدَّقَائِقِ. عِنْدَمَا يُشِيرُ إِلَى الرَّقْمِ 12 تَكُونُ السَّاعَةُ تَمَامًا، وَعِنْدَمَا يُشِيرُ إِلَى 6 تَكُونُ السَّاعَةُ وَالنِّصْفَ.'}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                <p className="text-base md:text-lg font-black text-amber-950 leading-relaxed">
                  {lang === 'en' ? (
                    <>
                      Golden Rule: <strong>1 Hour = 60 Minutes</strong>. And half an hour has <strong>30 Minutes</strong>.
                    </>
                  ) : (
                    <>
                      قَاعِدَةٌ ذَهَبِيَّةٌ: <strong>السَّاعَةُ الْوَاحِدَةُ فِيهَا 60 دَقِيقَةً</strong>. وَنِصْفُ السَّاعَةِ فِيهِ <strong>30 دَقِيقَةً</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                  {lang === 'en' ? "O'clock (:00) & Half Past (:30)" : 'السَّاعَةُ تَمَامًا (:00) وَالسَّاعَةُ وَالنِّصْفُ (:30)'}
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'عِنْدَمَا يَكُونُ عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى الرَّقْمِ اِثْنَيْ عَشَرَ نَقُولُ تَمَامًا، مِثْلَ: السَّاعَةُ الثَّالِثَةُ تَمَامًا. وَعِنْدَمَا يَكُونُ عَلَى الرَّقْمِ سِتَّةٍ نَقُولُ وَالنِّصْفُ، مِثْلَ: السَّاعَةُ الثَّالِثَةُ وَالنِّصْفُ.',
                      "When the long blue hand points to 12, we say o'clock. For example, 4 o'clock. When it points to 6, we say half past 4."
                    )
                  }
                  className="flex items-center gap-2 text-sm font-black text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-200 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'en' ? 'Listen to Lesson 🔊' : 'اِسْتَمِعْ لِلشَّرْحِ 🔊'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-sky-50 border-2 border-sky-200 flex flex-col gap-3">
                  <div className="font-black text-sky-950 text-lg">
                    {lang === 'en' ? "O'clock (:00)" : 'السَّاعَةُ تَمَامًا (:00)'}
                  </div>
                  <p className="text-base text-slate-800 font-bold leading-relaxed">
                    {lang === 'en' ? (
                      <>
                        The minute hand points to <strong>number 12</strong>.
                        <br />
                        Example: <strong>04:00</strong> is read: &quot;4 o&apos;clock&quot;.
                      </>
                    ) : (
                      <>
                        عَقْرَبُ الدَّقَائِقِ يُشِيرُ إِلَى <strong>الرَّقْمِ 12</strong>.
                        <br />
                        مِثَالٌ: <strong>04:00</strong> تُقْرَأُ: «السَّاعَةُ الرَّابِعَةُ تَمَامًا».
                      </>
                    )}
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex flex-col gap-3">
                  <div className="font-black text-emerald-950 text-lg">
                    {lang === 'en' ? 'Half Past (:30)' : 'السَّاعَةُ وَالنِّصْفُ (:30)'}
                  </div>
                  <p className="text-base text-slate-800 font-bold leading-relaxed">
                    {lang === 'en' ? (
                      <>
                        The minute hand points to <strong>number 6</strong> (30 minutes passed).
                        <br />
                        Example: <strong>04:30</strong> is read: &quot;Half past 4&quot;.
                      </>
                    ) : (
                      <>
                        عَقْرَبُ الدَّقَائِقِ يُشِيرُ إِلَى <strong>الرَّقْمِ 6</strong>.
                        <br />
                        مِثَالٌ: <strong>04:30</strong> تُقْرَأُ: «السَّاعَةُ الرَّابِعَةُ وَالنِّصْفُ».
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fractions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                  {lang === 'en' ? 'Quarter Past (:15) & Quarter To (:45)' : 'قِرَاءَةُ الْأَرْبَاعِ: وَالرُّبْعُ (:15) وَإِلَّا رُبْعًا (:45)'}
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'عِنْدَمَا يَكُونُ عَقْرَبُ الدَّقَائِقِ عَلَى الرَّقْمِ ثَلَاثَةٍ نَقُولُ وَالرُّبْعُ، أَيْ خَمْسَ عَشْرَةَ دَقِيقَةً. وَعِنْدَمَا يَكُونُ عَلَى الرَّقْمِ تِسْعَةٍ نَقُولُ إِلَّا رُبْعًا، أَيْ خَمْسٌ وَأَرْبَعُونَ دَقِيقَةً.',
                      'When the minute hand is on 3, it is quarter past 15 minutes. When it is on 9, it is quarter to 45 minutes.'
                    )
                  }
                  className="flex items-center gap-2 text-sm font-black text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-200 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'en' ? 'Listen to Lesson 🔊' : 'اِسْتَمِعْ لِلشَّرْحِ 🔊'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-yellow-50 border-2 border-yellow-200">
                  <div className="font-black text-yellow-950 text-lg mb-1.5">
                    {lang === 'en' ? 'Quarter Past (:15)' : 'وَالرُّبْعُ (:15)'}
                  </div>
                  <p className="text-base text-slate-800 font-bold leading-relaxed">
                    {lang === 'en' ? (
                      <>
                        The blue minute hand is on <strong>number 3</strong> (15 minutes past).
                        <br />
                        Example: <strong>08:15</strong> is read: &quot;Quarter past 8&quot;.
                      </>
                    ) : (
                      <>
                        عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى <strong>الرَّقْمِ 3</strong> (مَرَّتْ 15 دَقِيقَةً).
                        <br />
                        مِثَالٌ: <strong>08:15</strong> تُقْرَأُ: «السَّاعَةُ الثَّامِنَةُ وَالرُّبْعُ».
                      </>
                    )}
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-200">
                  <div className="font-black text-rose-950 text-lg mb-1.5">
                    {lang === 'en' ? 'Quarter To (:45)' : 'إِلَّا رُبْعًا (:45)'}
                  </div>
                  <p className="text-base text-slate-800 font-bold leading-relaxed">
                    {lang === 'en' ? (
                      <>
                        The blue minute hand is on <strong>number 9</strong> (15 minutes until the next hour).
                        <br />
                        Example: <strong>07:45</strong> is read: &quot;Quarter to 8&quot;.
                      </>
                    ) : (
                      <>
                        عَقْرَبُ الدَّقَائِقِ الْأَزْرَقُ عَلَى <strong>الرَّقْمِ 9</strong> (بَقِيَ رُبْعُ سَاعَةٍ لِتَكْتَمِلَ السَّاعَةُ التَّالِيَةُ).
                        <br />
                        مِثَالٌ: <strong>07:45</strong> تُقْرَأُ: «السَّاعَةُ الثَّامِنَةُ إِلَّا رُبْعًا».
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'multiples' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-950">
                  {lang === 'en' ? 'Counting by 5s Around the Clock 🎯' : 'الْعَدُّ بِالْخَمْسَاتِ لِقِرَاءَةِ دَقَائِقِ السَّاعَةِ 🎯'}
                </h3>
                <button
                  onClick={() =>
                    handleSpeakTab(
                      'كُلُّ رَقْمٍ عَلَى السَّاعَةِ يُمَثِّلُ خَمْسَ دَقَائِقَ. الرَّقْمُ وَاحِدٌ هُوَ خَمْسُ دَقَائِقَ، وَالرَّقْمُ اِثْنَانِ هُوَ عَشْرُ دَقَائِقَ، وَالرَّقْمُ ثَلَاثَةٌ هُوَ خَمْسَ عَشْرَةَ دَقِيقَةً.',
                      'Each number on the clock represents 5 minutes. Number 1 is 5 minutes, 2 is 10 minutes, 3 is 15 minutes, up to 12 which is 60 minutes.'
                    )
                  }
                  className="flex items-center gap-2 text-sm font-black text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-200 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'en' ? 'Listen to Lesson 🔊' : 'اِسْتَمِعْ لِلشَّرْحِ 🔊'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { num: 1, minEn: '05 mins', minAr: '05 دَقَائِقَ', labelEn: '5 Past', labelAr: 'وَخَمْسُ دَقَائِقَ' },
                  { num: 2, minEn: '10 mins', minAr: '10 دَقَائِقَ', labelEn: '10 Past', labelAr: 'وَعَشْرُ دَقَائِقَ' },
                  { num: 3, minEn: '15 mins', minAr: '15 دَقِيقَةً', labelEn: 'Quarter Past', labelAr: 'وَالرُّبْعُ' },
                  { num: 4, minEn: '20 mins', minAr: '20 دَقِيقَةً', labelEn: '20 Past', labelAr: 'وَالثُّلُثُ' },
                  { num: 5, minEn: '25 mins', minAr: '25 دَقِيقَةً', labelEn: '25 Past', labelAr: 'وَنِصْفٌ إِلَّا خَمْسًا' },
                  { num: 6, minEn: '30 mins', minAr: '30 دَقِيقَةً', labelEn: 'Half Past', labelAr: 'وَالنِّصْفُ' },
                  { num: 9, minEn: '45 mins', minAr: '45 دَقِيقَةً', labelEn: 'Quarter To', labelAr: 'إِلَّا رُبْعًا' },
                  { num: 12, minEn: '00 mins', minAr: '00 دَقِيقَةً', labelEn: "O'clock", labelAr: 'تَمَامًا' },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-center flex flex-col gap-1 shadow-2xs"
                  >
                    <span className="text-xs font-black text-slate-500">
                      {lang === 'en' ? `Number ${item.num}` : `الرَّقْمُ ${item.num}`}
                    </span>
                    <span className="text-base font-black text-blue-700 font-mono">
                      {lang === 'en' ? item.minEn : item.minAr}
                    </span>
                    <span className="text-sm font-black text-amber-900">
                      {lang === 'en' ? item.labelEn : item.labelAr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base transition cursor-pointer active:scale-95 shadow-md"
          >
            {lang === 'en' ? "I got it! Let's practice & play! 🚀" : 'فَهِمْتُ الشَّرْحَ، هَيَّا نَلْعَبْ وَنَتَعَلَّمْ! 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};

