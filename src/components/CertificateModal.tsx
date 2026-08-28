import React, { useState } from 'react';
import { Award, Star, X, Printer, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { Language } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
  lang?: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  starsCount,
  lang = 'en',
}) => {
  const [studentName, setStudentName] = useState<string>(lang === 'en' ? 'Superstar Student' : 'الْبَطَلُ الصَّغِيرُ');
  const [gradeText, setGradeText] = useState<string>(lang === 'en' ? 'Grade 2 Primary' : 'السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ');

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playFanfare();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (hidden on print) */}
        <div className="p-4 md:p-5 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5 text-slate-900 font-black text-base md:text-lg">
            <Award className="w-6 h-6 text-amber-500" />
            <span>{lang === 'en' ? 'Clock Master Certificate of Excellence 🎖️' : 'شَهَادَةُ بَطَلِ قِرَاءَةِ السَّاعَةِ 🎖️'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-black transition shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-5 h-5" />
              <span>{lang === 'en' ? 'Print Certificate' : 'طِبَاعَةُ الشَّهَادَةِ'}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Input Name customization (hidden on print) */}
        <div className="p-4 md:p-5 bg-amber-50/70 border-b border-amber-100 flex flex-col sm:flex-row gap-3 items-center print:hidden">
          <label className="text-sm font-black text-slate-900 shrink-0">
            {lang === 'en' ? 'Student Name:' : 'اِسْمُ التِّلْمِيذِ(ةِ):'}
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={lang === 'en' ? 'Enter student name' : 'اُكْتُبِ اسْمَ التِّلْمِيذِ هُنَا'}
            className="flex-1 px-4 py-2 rounded-2xl border-2 border-slate-300 text-base font-black focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
          />
          <select
            value={gradeText}
            onChange={(e) => setGradeText(e.target.value)}
            className="px-4 py-2 rounded-2xl border-2 border-slate-300 text-sm font-black bg-white cursor-pointer"
          >
            {lang === 'en' ? (
              <>
                <option value="Grade 2 Primary">Grade 2 Primary</option>
                <option value="Grade 3 Primary">Grade 3 Primary</option>
                <option value="Elementary School">Elementary School</option>
              </>
            ) : (
              <>
                <option value="السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ">السَّنَةُ الثَّانِيَةُ ابْتِدَائِيٌّ</option>
                <option value="السَّنَةُ الثَّالِثَةُ ابْتِدَائِيٌّ">السَّنَةُ الثَّالِثَةُ ابْتِدَائِيٌّ</option>
                <option value="الْمَرْحَلَةُ الِابْتِدَائِيَّةُ">الْمَرْحَلَةُ الِابْتِدَائِيَّةُ</option>
              </>
            )}
          </select>
        </div>

        {/* The Printable Certificate Design */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/70 text-center relative flex flex-col items-center justify-between min-h-[460px] border-8 border-double border-amber-400 m-4 rounded-3xl">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-amber-400 text-3xl">✦</div>
          <div className="absolute top-3 right-3 text-amber-400 text-3xl">✦</div>
          <div className="absolute bottom-3 left-3 text-amber-400 text-3xl">✦</div>
          <div className="absolute bottom-3 right-3 text-amber-400 text-3xl">✦</div>

          <div className="space-y-3">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-amber-100 text-amber-700 mb-2 border-2 border-amber-300">
              <Award className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-amber-950 tracking-wide font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
              {lang === 'en' ? 'Certificate of Excellence 🎓' : 'شَهَادَةُ تَفَوُّقٍ وَبَرَاعَةٍ 🎓'}
            </h1>
            <p className="text-base md:text-lg font-black text-amber-800">
              {lang === 'en'
                ? 'For Masterful Achievement in Telling Time & Setting Clock Hands'
                : 'فِي قِرَاءَةِ وَكِتَابَةِ وَضَبْطِ السَّاعَةِ بِعَقَارِبِهَا وَالْأَرْقَامِ'}
            </p>
          </div>

          <div className="my-6 space-y-3">
            <p className="text-base text-slate-700 font-bold">
              {lang === 'en' ? 'Proudly presented to superstar learner:' : 'تُمْنَحُ هَذِهِ الشَّهَادَةُ بِكُلِّ فَخْرٍ لِلتِّلْمِيذِ(ةِ) الْمُتَمَيِّزِ(ةِ):'}
            </p>
            <div className="text-3xl md:text-5xl font-black text-slate-950 border-b-4 border-amber-400 pb-2 px-8 inline-block font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
              {studentName || (lang === 'en' ? 'Superstar Student' : 'الْبَطَلُ الصَّغِيرُ')}
            </div>
            <p className="text-base md:text-lg font-black text-slate-800">
              {gradeText}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 bg-amber-100/90 px-5 py-2.5 rounded-2xl border-2 border-amber-300">
            <Star className="w-6 h-6 fill-amber-400 text-amber-600" />
            <span className="font-black text-base md:text-lg text-amber-950">
              {lang === 'en' ? `Stars Earned: ${starsCount} Excellence Stars ⭐` : `رَصِيدُ النُّجُومِ الْمُجَمَّعَةِ: ${starsCount} نَجْمَةَ تَفَوُّقٍ ⭐`}
            </span>
          </div>

          <div className="w-full flex items-center justify-between pt-6 border-t border-amber-200 mt-6 text-sm text-slate-600 font-black">
            <div>{lang === 'en' ? `Date: ${new Date().toLocaleDateString('en-US')}` : `التَّارِيخُ: ${new Date().toLocaleDateString('ar-EG')}`}</div>
            <div className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'en' ? 'Verified Clock Champion' : 'مُتْقِنٌ لِقِرَاءَةِ السَّاعَةِ بِنَجَاحٍ'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
