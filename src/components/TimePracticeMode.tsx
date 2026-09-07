import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { Language } from '../types';
import { Sun, Moon, Volume2, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Star, Sparkles, HelpCircle } from 'lucide-react';

interface TimePracticeModeProps {
  onEarnStar: () => void;
  lang?: Language;
}

interface Question {
  analogHour: number; // 1 to 12 as shown on clock hands
  minutes: number;    // 0 to 59
  period: 'am' | 'pm';
  correctHour24: number; // 0-23
}

export const TimePracticeMode: React.FC<TimePracticeModeProps> = ({
  onEarnStar,
  lang = 'ar',
}) => {
  const currentLang = lang || 'ar';

  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userHour, setUserHour] = useState<string>('');
  const [userMin, setUserMin] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [stars, setStars] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const hourInputRef = useRef<HTMLInputElement | null>(null);
  const minInputRef = useRef<HTMLInputElement | null>(null);

  // Generate a realistic, educational practice question
  const generateQuestion = useCallback((): Question => {
    // Clock face shows 1 to 12
    const analogHour = Math.floor(Math.random() * 12) + 1;

    // Realistic minute intervals suited for primary grade (0, 15, 30, 45, or multiples of 5)
    const minutePool = [0, 0, 15, 15, 30, 30, 45, 45, 10, 20, 40, 50];
    const minutes = minutePool[Math.floor(Math.random() * minutePool.length)];

    // Randomly select AM (صباحاً) or PM (مساءً)
    const period: 'am' | 'pm' = Math.random() > 0.5 ? 'pm' : 'am';

    let correctHour24: number;
    if (period === 'pm') {
      // For PM, 12 is 12 (noon), 1 to 11 becomes 13 to 23
      correctHour24 = analogHour === 12 ? 12 : analogHour + 12;
    } else {
      // For AM, 12 is 0 (or 12 in 12h), 1 to 11 is 1 to 11
      correctHour24 = analogHour === 12 ? 12 : analogHour;
    }

    return {
      analogHour,
      minutes,
      period,
      correctHour24,
    };
  }, []);

  // Load first question
  useEffect(() => {
    const q = generateQuestion();
    setCurrentQuestion(q);
    setUserHour('');
    setUserMin('');
    setFeedback('idle');
    setShowHint(false);
  }, [generateQuestion]);

  // Focus hour input when new question loads
  useEffect(() => {
    if (hourInputRef.current && feedback === 'idle') {
      hourInputRef.current.focus();
    }
  }, [currentQuestion, feedback]);

  const speakPrompt = () => {
    if (!currentQuestion || isSpeaking) return;
    setIsSpeaking(true);
    sounds.playClick();

    if (currentLang === 'en') {
      const pText = currentQuestion.period === 'pm' ? 'evening / 24-hour time' : 'morning time';
      const prompt = `Write the time shown on the clock in ${pText}.`;
      sounds.speakEnglish(prompt, () => setIsSpeaking(false));
    } else {
      const pText =
        currentQuestion.period === 'pm'
          ? 'بِتَوْقِيتِ الْمَسَاءِ بِنِظَامِ 24 سَاعَةٍ'
          : 'بِتَوْقِيتِ الصَّبَاحِ';
      const prompt = `اكْتُبِ الْوَقْتَ الَّذِي تُشِيرُ إِلَيْهِ السَّاعَةُ ${pText}.`;
      sounds.speakArabic(prompt, () => setIsSpeaking(false));
    }
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const handleHourChange = (val: string) => {
    // Only accept numbers up to 2 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 2);
    setUserHour(cleaned);
    if (cleaned.length === 2 && minInputRef.current) {
      minInputRef.current.focus();
    }
  };

  const handleMinChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 2);
    setUserMin(cleaned);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    sounds.playClick();

    const enteredH = parseInt(userHour, 10);
    const enteredM = parseInt(userMin, 10);

    if (isNaN(enteredH) || isNaN(enteredM)) {
      sounds.playWrong();
      setFeedback('wrong');
      return;
    }

    const isMinutesCorrect = enteredM === currentQuestion.minutes;

    let isHourCorrect = false;
    if (currentQuestion.period === 'pm') {
      // In 24h evening: e.g. 1 -> 13, 10 -> 22, 12 -> 12
      isHourCorrect = enteredH === currentQuestion.correctHour24;
    } else {
      // In morning: e.g. 1 -> 1 or 01, 12 -> 12
      isHourCorrect = enteredH === currentQuestion.correctHour24 || (currentQuestion.correctHour24 === 12 && enteredH === 0);
    }

    if (isHourCorrect && isMinutesCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
      setStars((prev) => prev + 1);
      onEarnStar();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe confetti fallback
      }
    } else {
      sounds.playWrong();
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    sounds.playClick();
    const nextQ = generateQuestion();
    setCurrentQuestion(nextQ);
    setUserHour('');
    setUserMin('');
    setFeedback('idle');
    setShowHint(false);
    setQuestionIndex((prev) => prev + 1);
  };

  if (!currentQuestion) return null;

  const isPm = currentQuestion.period === 'pm';
  const formattedMinutes = currentQuestion.minutes.toString().padStart(2, '0');
  const formattedHour = currentQuestion.correctHour24.toString().padStart(2, '0');

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch overflow-hidden">
      {/* 1. Left Card: The Analog Clock Face (نظيفة وواضحة تماماً) */}
      <div className="w-full md:w-[350px] lg:w-[390px] bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between shrink-0 overflow-hidden">
        {/* Top Header Tag */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 px-1 shrink-0 pb-1 border-b border-slate-100">
          <span className="flex items-center gap-1.5 text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {currentLang === 'en' ? 'Analog Clock Face:' : 'عَقَارِبُ السَّاعَةِ:'}
            </span>
          </span>
          <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg text-xs font-black border border-amber-200">
            {currentLang === 'en' ? `Question #${questionIndex}` : `السُّؤَالُ #${questionIndex}`}
          </span>
        </div>

        {/* Clean Clock Display without interactive drag clutter */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center py-2">
          <InteractiveClock
            hours={currentQuestion.analogHour}
            minutes={currentQuestion.minutes}
            interactive={false}
            showMinuteRing={true}
            showFractionsOverlay={false}
            showHandLabels={false}
            size={280}
            lang={currentLang}
          />
        </div>

        {/* Subtle Hands Reference Legend */}
        <div className="w-full flex items-center justify-center gap-4 text-xs font-black text-slate-600 pt-1 shrink-0">
          <div className="flex items-center gap-1.5 bg-red-50 text-red-800 px-2.5 py-1 rounded-xl border border-red-200 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>{currentLang === 'en' ? 'Hour Hand' : 'عَقْرَبُ السَّاعَاتِ (قَصِيرٌ)'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-xl border border-blue-200 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>{currentLang === 'en' ? 'Minute Hand' : 'عَقْرَبُ الدَّقَائِقِ (طَوِيلٌ)'}</span>
          </div>
        </div>
      </div>

      {/* 2. Right Card: Clean, Uncluttered Question & Digital Input */}
      <div className="w-full md:flex-1 min-h-0 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between overflow-y-auto app-scrollable-card gap-3">
        {/* Top Status Bar: Stars & Listen Prompt */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs sm:text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{currentLang === 'en' ? `Stars: ${stars}` : `النُّجُومُ: ${stars}`}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={speakPrompt}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-2xs active:scale-95 border ${
              isSpeaking
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title={currentLang === 'en' ? 'Listen to Question' : 'اسْتَمِعْ لِلسُّؤَالِ'}
          >
            <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{currentLang === 'en' ? 'Listen 🔊' : 'اسْتَمِعْ 🔊'}</span>
          </button>
        </div>

        {/* The Question Prompt Card with Period Badge (صباحاً ☀️ / مساءً 🌙) */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
            isPm
              ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950'
              : 'bg-amber-50/90 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isPm ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-black shadow-xs">
                <Moon className="w-4 h-4 text-indigo-200" />
                <span>{currentLang === 'en' ? 'Evening / PM (24-Hour)' : 'تَوْقِيتُ الْمَسَاءِ (نِظَامُ 24 سَاعَةٍ)'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-black shadow-xs">
                <Sun className="w-4 h-4 text-yellow-100" />
                <span>{currentLang === 'en' ? 'Morning / AM' : 'تَوْقِيتُ الصَّبَاحِ (صَبَاحًا)'}</span>
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black leading-snug">
            {currentLang === 'en'
              ? isPm
                ? 'Write the time indicated by the clock in evening time (24-hour system):'
                : 'Write the time indicated by the clock in morning time:'
              : isPm
              ? 'اكْتُبِ الْوَقْتَ الَّذِي تُشِيرُ إِلَيْهِ السَّاعَةُ بِتَوْقِيتِ الْمَسَاءِ (نِظَامِ 24 سَاعَةٍ):'
              : 'اكْتُبِ الْوَقْتَ الَّذِي تُشِيرُ إِلَيْهِ السَّاعَةُ بِتَوْقِيتِ الصَّبَاحِ:'}
          </h3>

          {/* Clean Hint Note */}
          <div className="mt-2 text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {currentLang === 'en'
                ? isPm
                  ? 'Hint: In the evening, add 12 to the hour hand (e.g., 1 becomes 13, 2 becomes 14).'
                  : 'Hint: In the morning, write the hour as pointed by the hand (01 to 11).'
                : isPm
                ? 'تَذَكَّرْ: فِي الْمَسَاءِ نُضِيفُ 12 إِلَى عَقْرَبِ السَّاعَاتِ (مَثَلًا: 1 تُصْبِحُ 13، وَ2 تُصْبِحُ 14).'
                : 'تَذَكَّرْ: فِي الصَّبَاحِ نَكْتُبُ السَّاعَةَ كَمَا يُشِيرُ إِلَيْهَا الْعَقْرَبُ.'}
            </span>
          </div>
        </div>

        {/* Clean, Focused Digital Input Fields (واجهة نظيفة جداً وبسيطة) */}
        <div className="flex flex-col items-center justify-center my-auto py-2 gap-3">
          <div className="text-xs sm:text-sm font-black text-slate-600 text-center">
            {currentLang === 'en' ? 'Enter hours and minutes:' : 'أَدْخِلِ السَّاعَةَ وَالدَّقَائِقَ:'}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (feedback !== 'correct') checkAnswer();
            }}
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
            {/* Hours Input */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-black text-slate-500">
                {currentLang === 'en' ? 'Hours' : 'السَّاعَاتُ'}
              </span>
              <input
                ref={hourInputRef}
                id="user-hour-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                disabled={feedback === 'correct'}
                value={userHour}
                onChange={(e) => handleHourChange(e.target.value)}
                placeholder="00"
                className="w-18 h-16 sm:w-22 sm:h-20 text-center text-2xl sm:text-3xl font-black font-mono bg-slate-900 text-amber-400 rounded-2xl border-2 border-slate-700 focus:border-amber-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Separator Colon */}
            <span className="text-3xl sm:text-4xl font-black text-slate-800 self-end mb-4">:</span>

            {/* Minutes Input */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-black text-slate-500">
                {currentLang === 'en' ? 'Minutes' : 'الدَّقَائِقُ'}
              </span>
              <input
                ref={minInputRef}
                id="user-minute-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                disabled={feedback === 'correct'}
                value={userMin}
                onChange={(e) => handleMinChange(e.target.value)}
                placeholder="00"
                className="w-18 h-16 sm:w-22 sm:h-20 text-center text-2xl sm:text-3xl font-black font-mono bg-slate-900 text-amber-400 rounded-2xl border-2 border-slate-700 focus:border-amber-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Period Indicator Tag */}
            <div className="self-end mb-3">
              <span className="text-sm sm:text-base font-black px-2.5 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-300">
                {isPm ? (currentLang === 'en' ? 'PM' : 'م') : (currentLang === 'en' ? 'AM' : 'ص')}
              </span>
            </div>
          </form>
        </div>

        {/* Feedback Area / Results Banner */}
        {feedback === 'correct' && (
          <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500 text-white rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-sm sm:text-base text-emerald-900">
                  {currentLang === 'en' ? 'Excellent! Correct Answer! 🎉' : 'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ بَارِعَةٌ! 🎉'}
                </p>
                <p className="text-xs font-bold text-emerald-700">
                  {currentLang === 'en'
                    ? `The time is exactly ${formattedHour}:${formattedMinutes}`
                    : `السَّاعَةُ بِالضَّبْطِ هِيَ: ${formattedHour}:${formattedMinutes}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="next-question-btn"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xs active:scale-95 cursor-pointer shrink-0"
            >
              <span>{currentLang === 'en' ? 'Next' : 'السُّؤَالُ التَّالِي'}</span>
              {currentLang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="p-3 sm:p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-center justify-between gap-3 animate-fade-in">
            <div>
              <p className="font-black text-xs sm:text-sm text-rose-900">
                {currentLang === 'en' ? 'Not quite, try again! 😊' : 'حَاوِلْ مَرَّةً أُخْرَى! رَكِّزْ جَيِّدًا 😊'}
              </p>
              <p className="text-[11px] font-bold text-rose-700">
                {currentLang === 'en'
                  ? isPm
                    ? `In the evening, hour ${currentQuestion.analogHour} corresponds to ${formattedHour}.`
                    : `In the morning, the hour is ${formattedHour}.`
                  : isPm
                  ? `فِي الْمَسَاءِ، السَّاعَةُ ${currentQuestion.analogHour} تُوَافِقُ ${formattedHour}.`
                  : `فِي الصَّبَاحِ، السَّاعَةُ هِيَ ${formattedHour}.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setFeedback('idle');
                if (hourInputRef.current) hourInputRef.current.focus();
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-950 font-black text-xs cursor-pointer active:scale-95 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Retry' : 'إِعَادَةٌ'}</span>
            </button>
          </div>
        )}

        {/* Action Button: Check Answer (Clean, single prominent button) */}
        {feedback !== 'correct' && (
          <div className="flex items-center justify-center pt-2 shrink-0">
            <button
              type="button"
              id="submit-answer-btn"
              onClick={checkAnswer}
              className="w-full max-w-[320px] py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm sm:text-base shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{currentLang === 'en' ? 'Check Answer' : 'تَأَكَّدْ مِنَ الإِجَابَةِ'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
