import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatEnglishSpokenTime } from '../utils/timeFormatters';
import { QuizQuestion, Language } from '../types';
import { Star, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, HelpCircle, Volume2 } from 'lucide-react';

interface QuizModeProps {
  onEarnStar: () => void;
  lang?: Language;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  onEarnStar,
  lang = 'en',
}: {
  onEarnStar: () => void;
  lang?: Language;
}) => {
  const currentLang: Language = lang || 'en';
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const generateQuizQuestion = useCallback((lvl: number, currentLang: Language): QuizQuestion => {
    const id = `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (lvl === 1) {
      // Level 1: On the hour (00) or half past (30)
      m = Math.random() > 0.5 ? 0 : 30;
    } else if (lvl === 2) {
      // Level 2: Quarters (00, 15, 30, 45)
      const options = [0, 15, 30, 45];
      m = options[Math.floor(Math.random() * options.length)];
    } else {
      // Level 3: 5-minute increments & thirds
      const options = [5, 10, 15, 20, 30, 40, 45, 50];
      m = options[Math.floor(Math.random() * options.length)];
    }

    if (currentLang === 'en') {
      const correctSpoken = formatEnglishSpokenTime(h, m, false);

      // Build distractors
      const distractors: string[] = [];
      const wrongH1 = (h % 12) + 1;
      distractors.push(formatEnglishSpokenTime(wrongH1, m, false));

      const diffMinutes = [0, 15, 30, 45, 20].filter((min) => min !== m);
      const wrongM = diffMinutes[Math.floor(Math.random() * diffMinutes.length)] || (m === 0 ? 30 : 0);
      distractors.push(formatEnglishSpokenTime(h, wrongM, false));

      const wrongH3 = (h + 2) % 12 || 12;
      distractors.push(formatEnglishSpokenTime(wrongH3, (m === 30 ? 0 : 30), false));

      const uniqueOptions = Array.from(new Set([correctSpoken, ...distractors])).slice(0, 4);

      const shuffled = uniqueOptions
        .map((text, i) => {
          const isCorr = text === correctSpoken;
          return {
            id: `opt-${i}`,
            text,
            spokenText: text,
            isCorrect: isCorr,
          };
        })
        .sort(() => Math.random() - 0.5);

      const explanation = `The short red hour hand points to ${h}, and the long blue minute hand points to ${
        m === 0 ? "12 (o'clock)" : m === 15 ? '3 (quarter past)' : m === 30 ? '6 (half past)' : m === 45 ? '9 (quarter to)' : `minute ${m}`
      }. So the time is: ${correctSpoken}.`;

      return {
        id,
        targetHours: h,
        targetMinutes: m,
        questionPrompt: 'What time does the clock show?',
        spokenPrompt: 'What time does the clock show? Choose the correct answer.',
        options: shuffled,
        explanation,
        spokenExplanation: explanation,
      };
    }

    const correctSpoken = formatArabicSpokenTime(h, m, false, false);
    const correctPhonetic = formatArabicSpokenTime(h, m, false, true);

    // Build 3 plausible distractor answers for Grade 2
    const distractors: string[] = [];

    // Distractor 1: Next hour with same minutes
    const wrongH1 = (h % 12) + 1;
    distractors.push(formatArabicSpokenTime(wrongH1, m, false, false));

    // Distractor 2: Different minute fraction with same hour
    const diffMinutes = [0, 15, 30, 45, 20].filter((min) => min !== m);
    const wrongM = diffMinutes[Math.floor(Math.random() * diffMinutes.length)] || (m === 0 ? 30 : 0);
    distractors.push(formatArabicSpokenTime(h, wrongM, false, false));

    // Distractor 3: Hour & fraction shift
    const wrongH3 = (h + 2) % 12 || 12;
    distractors.push(formatArabicSpokenTime(wrongH3, (m === 30 ? 0 : 30), false, false));

    // Unique list of 4 options
    const uniqueOptions = Array.from(new Set([correctSpoken, ...distractors])).slice(0, 4);

    // Shuffle options
    const shuffled = uniqueOptions
      .map((text, i) => {
        const isCorr = text === correctSpoken;
        return {
          id: `opt-${i}`,
          text,
          spokenText: isCorr ? correctPhonetic : text,
          isCorrect: isCorr,
        };
      })
      .sort(() => Math.random() - 0.5);

    const explanation = `عَقْرَبُ السَّاعَاتِ (الْأَحْمَرُ الْقَصِيرُ) يُشِيرُ إِلَى ${h}، وَعَقْرَبُ الدَّقَائِقِ (الْأَزْرَقُ الطَّوِيلُ) يُشِيرُ إِلَى ${
      m === 0 ? 'الرَّقْمِ 12 أَيْ (تَمَامًا)' : m === 15 ? 'الرَّقْمِ 3 أَيْ (وَالرُّبْعُ)' : m === 30 ? 'الرَّقْمِ 6 أَيْ (وَالنِّصْفُ)' : m === 45 ? 'الرَّقْمِ 9 أَيْ (إِلَّا رُبْعًا)' : `الدَّقِيقَةِ ${m}`
    }، فَتَكُونُ السَّاعَةُ: ${correctSpoken}.`;

    return {
      id,
      targetHours: h,
      targetMinutes: m,
      questionPrompt: 'كَمْ تُشِيرُ السَّاعَةُ فِي الرَّسْمِ الْمُجَاوِرِ؟',
      spokenPrompt: 'كَمْ تُشِيرُ السَّاعَةُ فِي الرَّسْمِ الْمُجَاوِرِ؟ اِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.',
      options: shuffled,
      explanation,
      spokenExplanation: explanation,
    };
  }, []);

  const nextQuestion = useCallback(() => {
    const q = generateQuizQuestion(selectedLevel, currentLang);
    setCurrentQuestion(q);
    setSelectedOptionId(null);
    setIsAnswered(false);
    // Speak the question prompt
    if (currentLang === 'en') {
      sounds.speakEnglish('What time does the clock show? Choose the correct answer.');
    } else {
      sounds.speakArabic('كَمْ تُشِيرُ السَّاعَةُ فِي الرَّسْمِ الْمُجَاوِرِ؟ اِخْتَرِ الْإِجَابَةَ الصَّحِيحَةَ.');
    }
  }, [generateQuizQuestion, selectedLevel, currentLang]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    setQuestionCount((c) => c + 1);

    if (isCorrect) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      sounds.speakCheer(true, currentLang);
      onEarnStar();

      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    } else {
      setStreak(0);
      sounds.playWrong();
      sounds.speakCheer(false, currentLang);
    }
  };

  const handleSpeakOption = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (currentLang === 'en') {
      sounds.speakEnglish(text);
    } else {
      sounds.speakArabic(text);
    }
  };

  const handleSpeakExplanation = () => {
    if (currentQuestion) {
      if (lang === 'en') {
        sounds.speakEnglish(currentQuestion.explanation);
      } else {
        sounds.speakArabic(currentQuestion.explanation);
      }
    }
  };

  return (
    <div className="app-game-card w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-2.5 sm:gap-3.5 items-stretch overflow-hidden">
      {/* Left Column: Clock Question Face */}
      <div className="w-full lg:w-[380px] bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between shrink-0 overflow-hidden">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 mb-1 shrink-0">
          <span className="text-amber-800 truncate">
            {lang === 'en' ? 'Look at the clock hands ⏱️' : 'اُنْظُرْ إِلَى عَقَارِبِ السَّاعَةِ ⏱️'}
          </span>
          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg font-black border border-amber-300 text-xs">
            {lang === 'en' ? `#${questionCount + 1}` : `سُؤَالٌ ${questionCount + 1}`}
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden py-1">
          {currentQuestion && (
            <InteractiveClock
              hours={currentQuestion.targetHours}
              minutes={currentQuestion.targetMinutes}
              interactive={false}
              showMinuteRing={selectedLevel === 3}
              showHandLabels={true}
              size={320}
              lang={lang}
            />
          )}
        </div>

        {/* Level Switcher */}
        <div className="w-full mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
          <div className="text-xs font-black text-slate-700">
            {lang === 'en' ? 'Select Level:' : 'مُسْتَوَى الْأَسْئِلَةِ:'}
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-black">
            {[
              { id: 1, label: lang === 'en' ? "1. O'clock & Half" : '1. تَمَامًا وَنِصْفٌ' },
              { id: 2, label: lang === 'en' ? '2. Quarters' : '2. رُبْعٌ وَإِلَّا رُبْعًا' },
              { id: 3, label: lang === 'en' ? '3. 5-Min Multiples' : '3. كُلُّ 5 دَقَائِقَ' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedLevel(lvl.id);
                }}
                className={`py-2 px-1 rounded-xl transition text-center active:scale-95 cursor-pointer border ${
                  selectedLevel === lvl.id
                    ? 'bg-amber-500 border-amber-600 text-white shadow-2xs font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate block">{lvl.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Multiple Choice Options & Explanation */}
      <div className="w-full lg:flex-1 min-h-0 flex flex-col gap-2 shrink-1 overflow-hidden">
        {/* Header Stats */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1 rounded-xl border border-amber-200 text-xs sm:text-sm font-black">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{lang === 'en' ? `Score: ${score}` : `النِّقَاطُ: ${score}`}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-xl border border-emerald-200 text-xs font-black animate-pulse">
                <span>{streak} 🔥</span>
              </div>
            )}
          </div>

          <button
            onClick={nextQuestion}
            className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition active:scale-95 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Skip' : 'تَخَطَّ'}</span>
          </button>
        </div>

        {/* Question & Options */}
        {currentQuestion && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto app-scrollable-card">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 shrink-0">
                <h3 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-1.5">
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{currentQuestion.questionPrompt}</span>
                </h3>

                <button
                  onClick={() => {
                    if (lang === 'en') {
                      sounds.speakEnglish(currentQuestion.questionPrompt);
                    } else {
                      sounds.speakArabic(currentQuestion.questionPrompt);
                    }
                  }}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer active:scale-95 shrink-0"
                  title={lang === 'en' ? 'Listen to question' : 'اِسْتَمِعْ لِلسُّؤَالِ'}
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                </button>
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {currentQuestion.options.map((opt) => {
                  let containerClass = 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-amber-300 text-slate-900';
                  let icon = null;

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      containerClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-2xs ring-1 ring-emerald-200';
                      icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
                    } else if (selectedOptionId === opt.id && !opt.isCorrect) {
                      containerClass = 'bg-rose-50 border-rose-500 text-rose-950 font-black';
                      icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                    } else {
                      containerClass = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-1 rounded-xl border transition-all flex items-center gap-1.5 shadow-2xs ${containerClass}`}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleSpeakOption(e, opt.text)}
                        className="p-2 rounded-lg bg-white hover:bg-amber-100/70 text-slate-800 shadow-2xs border border-slate-200 cursor-pointer shrink-0 transition active:scale-95"
                        title={lang === 'en' ? 'Listen to option' : 'اِسْتَمِعْ لِلْخِيَارِ'}
                      >
                        <Volume2 className="w-4 h-4 text-amber-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        disabled={isAnswered}
                        className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default transition active:scale-[0.99] ${
                          lang === 'en' ? 'text-left' : 'text-right'
                        }`}
                      >
                        <span className="font-black text-sm sm:text-base md:text-lg">{opt.text}</span>
                        {icon}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation & Next Question Button */}
            {isAnswered && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2 shrink-0">
                <div className="bg-blue-50 text-blue-950 p-2.5 rounded-2xl border border-blue-200 text-xs sm:text-sm font-bold leading-relaxed flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-950 text-xs sm:text-sm">
                      {lang === 'en' ? '💡 Explanation:' : '💡 الشَّرْحُ:'}
                    </span>
                    <button
                      onClick={handleSpeakExplanation}
                      className="flex items-center gap-1 text-xs font-black bg-blue-100 hover:bg-blue-200 text-blue-900 px-2.5 py-1 rounded-lg transition cursor-pointer border border-blue-300"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Listen' : 'اسْتَمِعْ'}</span>
                    </button>
                  </div>
                  <div className="text-slate-800">{currentQuestion.explanation}</div>
                </div>

                <button
                  id="quiz-next-question-btn"
                  onClick={nextQuestion}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm sm:text-base shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{lang === 'en' ? 'Next Question' : 'السُّؤَالُ التَّالِي'}</span>
                  {lang === 'en' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

