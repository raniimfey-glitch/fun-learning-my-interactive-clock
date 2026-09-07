import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { Language } from '../types';
import { Sun, Moon, Volume2, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

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
  lang = 'ar' as Language,
}) => {
  const currentLang: Language = (lang as Language) || 'ar';

  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userHour, setUserHour] = useState<string>('');
  const [userMin, setUserMin] = useState<string>('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
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
      onEarnStar();
      // Spoken praise & encouragement (التحفيز المنطوق)
      setTimeout(() => {
        sounds.speakCheer(true, currentLang);
      }, 250);

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
      // Spoken gentle encouragement
      setTimeout(() => {
        sounds.speakCheer(false, currentLang);
      }, 250);
    }
  };

  const togglePeriod = () => {
    sounds.playClick();
    if (!currentQuestion) return;
    const newPeriod: 'am' | 'pm' = currentQuestion.period === 'am' ? 'pm' : 'am';
    let correctHour24: number;
    if (newPeriod === 'pm') {
      correctHour24 = currentQuestion.analogHour === 12 ? 12 : currentQuestion.analogHour + 12;
    } else {
      correctHour24 = currentQuestion.analogHour === 12 ? 12 : currentQuestion.analogHour;
    }
    setCurrentQuestion({
      ...currentQuestion,
      period: newPeriod,
      correctHour24,
    });
    setFeedback('idle');
  };

  const handleNext = () => {
    sounds.playClick();
    const nextQ = generateQuestion();
    setCurrentQuestion(nextQ);
    setUserHour('');
    setUserMin('');
    setFeedback('idle');
    setQuestionIndex((prev) => prev + 1);
  };

  if (!currentQuestion) return null;

  const isPm = currentQuestion.period === 'pm';
  const formattedMinutes = currentQuestion.minutes.toString().padStart(2, '0');
  const formattedHour = currentQuestion.correctHour24.toString().padStart(2, '0');

  return (
    <div className="w-full max-w-3xl lg:max-w-[760px] mx-auto flex-1 min-h-0 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch justify-center overflow-hidden">
      {/* 1. Left Card: The Analog Clock Face (عرض أصغر ومُحْكَم) */}
      <div className="w-full md:w-[290px] lg:w-[310px] bg-white rounded-2xl sm:rounded-3xl p-3 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between shrink-0 overflow-hidden">
        {/* Top Header Tag: زر المرور إلى السؤال الموالي */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 px-1 shrink-0 pb-1.5 border-b border-slate-100">
          <span className="flex items-center gap-1.5 text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {currentLang === 'en' ? 'Clock Face:' : 'عَقَارِبُ السَّاعَةِ:'}
            </span>
          </span>
          <button
            type="button"
            id="next-question-header-btn"
            onClick={handleNext}
            className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-950 px-2.5 py-1 rounded-xl text-xs font-black border border-amber-300 shadow-2xs cursor-pointer transition group"
            title={currentLang === 'en' ? 'Click to move to next question' : 'اضْغَطْ لِلْمُرُورِ إِلَى السُّؤَالِ الْمَوَالِي'}
          >
            <span>{currentLang === 'en' ? `Question #${questionIndex}` : `السُّؤَالُ #${questionIndex}`}</span>
            {currentLang === 'ar' ? (
              <ArrowLeft className="w-3.5 h-3.5 text-amber-700 group-hover:-translate-x-0.5 transition-transform" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>

        {/* Clean Clock Display without interactive drag clutter */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center py-1">
          <InteractiveClock
            hours={currentQuestion.analogHour}
            minutes={currentQuestion.minutes}
            interactive={false}
            showMinuteRing={true}
            showFractionsOverlay={false}
            showHandLabels={false}
            size={245}
            lang={currentLang}
          />
        </div>
      </div>

      {/* 2. Right Card: Clean, Uncluttered Question & Digital Input (عرض أصغر ومُحْكَم) */}
      <div className="w-full md:w-[340px] lg:w-[370px] bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between overflow-y-auto app-scrollable-card gap-3 shrink-0">
        {/* Top Control Bar: [زر التبديل: صباحاً / مساءً] - [زر التحقق] - [زر استمع] */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 border-b border-slate-100 shrink-0">
          {/* 1. زر التبديل: صباحاً / مساءً */}
          <button
            type="button"
            id="toggle-period-btn"
            onClick={togglePeriod}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs border shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0 ${
              isPm
                ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
            }`}
            title={currentLang === 'en' ? 'Switch Morning / Evening' : 'تَبْدِيلٌ: صَبَاحًا / مَسَاءً'}
          >
            {isPm ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{currentLang === 'en' ? 'Evening 🌙' : 'مَسَاءً 🌙 (تَبْدِيلٌ)'}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{currentLang === 'en' ? 'Morning ☀️' : 'صَبَاحًا ☀️ (تَبْدِيلٌ)'}</span>
              </>
            )}
          </button>

          {/* 2. زر التحقق: في الوسط بين زر التبديل وزر استمع */}
          <button
            type="button"
            id="check-answer-btn"
            onClick={checkAnswer}
            disabled={feedback === 'correct'}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black text-xs shadow-xs active:scale-95 cursor-pointer transition shrink-0"
            title={currentLang === 'en' ? 'Check Answer' : 'تَأَكَّدْ مِنَ الإِجَابَةِ'}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{currentLang === 'en' ? 'Check' : 'تَحَقَّقْ'}</span>
          </button>

          {/* 3. زر استمع */}
          <button
            type="button"
            id="speak-prompt-btn"
            onClick={speakPrompt}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95 border shrink-0 ${
              isSpeaking
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
            title={currentLang === 'en' ? 'Listen to Question' : 'اسْتَمِعْ لِلسُّؤَالِ'}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{currentLang === 'en' ? 'Listen 🔊' : 'اسْتَمِعْ 🔊'}</span>
          </button>
        </div>

        {/* Clean, Focused Digital Input Fields (الساعة يساراً والدقائق يميناً: dir="ltr") */}
        <div className="flex flex-col items-center justify-center my-auto py-3 gap-2.5">
          <div className="text-xs font-black text-slate-600 text-center">
            {currentLang === 'en' ? 'Enter hours and minutes:' : 'أَدْخِلِ السَّاعَةَ وَالدَّقَائِقَ:'}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (feedback !== 'correct') checkAnswer();
            }}
            dir="ltr"
            className="flex items-center justify-center gap-2 sm:gap-2.5"
          >
            {/* Hours Input: يساراً */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-black text-slate-500">
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
                className="w-18 h-16 sm:w-20 sm:h-18 text-center text-2xl sm:text-3xl font-black font-mono bg-slate-900 text-amber-400 rounded-2xl border-2 border-slate-700 focus:border-amber-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Separator Colon */}
            <span className="text-2xl sm:text-3xl font-black text-slate-800 self-end mb-4">:</span>

            {/* Minutes Input: يميناً */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-black text-slate-500">
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
                className="w-18 h-16 sm:w-20 sm:h-18 text-center text-2xl sm:text-3xl font-black font-mono bg-slate-900 text-amber-400 rounded-2xl border-2 border-slate-700 focus:border-amber-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Period Indicator Tag */}
            <div className="self-end mb-3">
              <span className="text-xs sm:text-sm font-black px-2.5 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-300">
                {isPm ? (currentLang === 'en' ? 'PM' : 'م') : (currentLang === 'en' ? 'AM' : 'ص')}
              </span>
            </div>
          </form>
        </div>

        {/* Feedback Area / Results Banner */}
        {feedback === 'correct' && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-2 animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500 text-white rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-xs text-emerald-900">
                    {currentLang === 'en' ? 'Excellent! Correct! 🎉' : 'أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ! 🎉'}
                  </p>
                  <button
                    type="button"
                    onClick={() => sounds.speakCheer(true, currentLang)}
                    className="p-1 rounded-lg bg-emerald-200 hover:bg-emerald-300 text-emerald-950 transition cursor-pointer active:scale-90"
                    title={currentLang === 'en' ? 'Replay voice encouragement' : 'إِعَادَةُ سَمَاعِ التَّشْجِيعِ الصَّوْتِيِّ'}
                  >
                    <Volume2 className="w-3 h-3 text-emerald-900" />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-emerald-700">
                  {currentLang === 'en'
                    ? `Time: ${formattedHour}:${formattedMinutes}`
                    : `السَّاعَةُ: ${formattedHour}:${formattedMinutes}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="next-question-btn"
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs active:scale-95 cursor-pointer shrink-0"
            >
              <span>{currentLang === 'en' ? 'Next' : 'التَّالِي'}</span>
              {currentLang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-center justify-between gap-2 animate-fade-in shrink-0">
            <div>
              <p className="font-black text-xs text-rose-900">
                {currentLang === 'en' ? 'Not quite, try again! 😊' : 'حَاوِلْ مَرَّةً أُخْرَى! رَكِّزْ جَيِّدًا 😊'}
              </p>
              <p className="text-[10px] font-bold text-rose-700">
                {currentLang === 'en'
                  ? isPm
                    ? `Evening: ${currentQuestion.analogHour} corresponds to ${formattedHour}.`
                    : `Morning: the hour is ${formattedHour}.`
                  : isPm
                  ? `فِي الْمَسَاءِ، ${currentQuestion.analogHour} تُوَافِقُ ${formattedHour}.`
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-950 font-black text-xs cursor-pointer active:scale-95 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{currentLang === 'en' ? 'Retry' : 'إِعَادَةٌ'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
