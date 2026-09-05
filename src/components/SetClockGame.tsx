import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { InteractiveClock } from './InteractiveClock';
import { sounds } from '../utils/soundEffects';
import { formatArabicSpokenTime, formatEnglishSpokenTime, formatDigitalTime } from '../utils/timeFormatters';
import { Language } from '../types';
import { CheckCircle2, RotateCcw, HelpCircle, Star, Award, Sparkles, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';

interface SetClockGameProps {
  onEarnStar: () => void;
  lang?: Language;
}

interface Challenge {
  hours: number;
  minutes: number;
  promptText: string;
  phoneticPrompt: string;
  hintText: string;
  level: number;
}

export const SetClockGame: React.FC<SetClockGameProps> = ({
  onEarnStar,
  lang = 'en',
}: {
  onEarnStar: () => void;
  lang?: Language;
}) => {
  const currentLang: Language = lang || 'en';
  const [level, setLevel] = useState<number>(1);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userHours, setUserHours] = useState<number>(12);
  const [userMinutes, setUserMinutes] = useState<number>(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const generateChallenge = useCallback((currentLevel: number, currentLang: Language): Challenge => {
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (currentLevel === 1) {
      // Level 1: On the hour (00) & half past (30)
      m = Math.random() > 0.5 ? 0 : 30;
    } else if (currentLevel === 2) {
      // Level 2: Quarters (00, 15, 30, 45)
      const minOptions = [0, 15, 30, 45];
      m = minOptions[Math.floor(Math.random() * minOptions.length)];
    } else {
      // Level 3: 5-minute multiples & thirds (05, 10, 15, 20, 30, 40, 45, 50)
      const minOptions = [5, 10, 15, 20, 30, 40, 45, 50];
      m = minOptions[Math.floor(Math.random() * minOptions.length)];
    }

    if (currentLang === 'en') {
      const spoken = formatEnglishSpokenTime(h, m, false);
      const prompt = `Set the clock to: ${spoken}`;
      const hint = `Point the red hour hand towards ${h}, and the blue minute hand towards ${
        m === 0 ? '12 (:00)' : `${m / 5} (:${m.toString().padStart(2, '0')})`
      }.`;

      return {
        hours: h,
        minutes: m,
        promptText: prompt,
        phoneticPrompt: prompt,
        hintText: hint,
        level: currentLevel,
      };
    }

    const spoken = formatArabicSpokenTime(h, m, false, false);
    const phonetic = formatArabicSpokenTime(h, m, false, true);

    const prompt = `اِضْبُطِ السَّاعَةَ عَلَى: ${spoken}`;
    const phoneticPrompt = `اِضْبُطِ السَّاعَةَ عَلَى: ${phonetic}`;

    const hint = `ضَعْ عَقْرَبَ السَّاعَاتِ (الْأَحْمَرَ الْقَصِيرَ) عِنْدَ الرَّقْمِ ${h}، وَعَقْرَبَ الدَّقَائِقِ (الْأَزْرَقَ الطَّوِيلَ) عِنْدَ ${
      m === 0 ? 'الرَّقْمِ 12 (:00)' : `الرَّقْمِ ${m / 5} (:${m.toString().padStart(2, '0')})`
    }.`;

    return {
      hours: h,
      minutes: m,
      promptText: prompt,
      phoneticPrompt,
      hintText: hint,
      level: currentLevel,
    };
  }, []);

  const speakPrompt = useCallback((textToSpeak: string) => {
    setIsSpeaking(true);
    if (currentLang === 'en') {
      sounds.speakEnglish(textToSpeak, () => {
        setIsSpeaking(false);
      });
    } else {
      sounds.speakArabic(textToSpeak, () => {
        setIsSpeaking(false);
      });
    }
    setTimeout(() => setIsSpeaking(false), 3000);
  }, [currentLang]);

  const loadNewChallenge = useCallback((lvl: number) => {
    const ch = generateChallenge(lvl, currentLang);
    setCurrentChallenge(ch);
    // Randomize initial clock hands
    let randH = Math.floor(Math.random() * 12) + 1;
    if (randH === ch.hours) randH = (randH % 12) + 1;
    setUserHours(randH);
    setUserMinutes(0);
    setFeedback('idle');
    setShowHint(false);
    // Speak challenge on load
    speakPrompt(ch.phoneticPrompt);
  }, [generateChallenge, currentLang, speakPrompt]);

  useEffect(() => {
    loadNewChallenge(level);
  }, [level, currentLang, loadNewChallenge]);

  const checkAnswer = () => {
    if (!currentChallenge) return;

    const targetH12 = currentChallenge.hours % 12 === 0 ? 12 : currentChallenge.hours % 12;
    const userH12 = userHours % 12 === 0 ? 12 : userHours % 12;

    const minuteDiff = Math.abs(userMinutes - currentChallenge.minutes);
    const isMinCorrect = minuteDiff === 0 || minuteDiff === 60;
    const isHourCorrect = userH12 === targetH12;

    if (isMinCorrect && isHourCorrect) {
      setFeedback('correct');
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      sounds.speakCheer(true, currentLang);
      onEarnStar();

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    } else {
      setFeedback('wrong');
      setStreak(0);
      sounds.playWrong();
      sounds.speakCheer(false, currentLang);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    loadNewChallenge(level);
  };

  const userDigital = formatDigitalTime(userHours, userMinutes);
  const userSpoken = lang === 'en'
    ? formatEnglishSpokenTime(userHours, userMinutes, false)
    : formatArabicSpokenTime(userHours, userMinutes, false, false);

  return (
    <div className="app-game-card w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-2.5 sm:gap-3.5 items-stretch overflow-hidden">
      {/* Left Column: Clock to Adjust */}
      <div className="w-full lg:w-[380px] bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs border border-slate-200/80 flex flex-col items-center justify-between shrink-0 overflow-hidden">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 mb-1 shrink-0">
          <span className="text-amber-800 truncate">
            {lang === 'en' ? 'Drag hands to target 🎯' : 'حَرِّكِ الْعَقَارِبَ لِتُطَابِقَ الْمَطْلُوبَ 🎯'}
          </span>
          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-lg text-slate-900 font-black border border-slate-200 text-xs">
            {userDigital.time12}
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden py-1">
          <InteractiveClock
            hours={userHours}
            minutes={userMinutes}
            onChangeTime={(h, m) => {
              setUserHours(h);
              setUserMinutes(m);
              if (feedback !== 'idle') setFeedback('idle');
            }}
            showMinuteRing={true}
            showHandLabels={true}
            highlightTarget={showHint && currentChallenge ? { hours: currentChallenge.hours, minutes: currentChallenge.minutes } : null}
            size={320}
            lang={lang}
          />
        </div>

        {/* Level Selector */}
        <div className="w-full mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5 shrink-0">
          <div className="text-xs font-black text-slate-700">
            {lang === 'en' ? 'Challenge Level:' : 'مُسْتَوَى التَّحَدِّي (سَنَةٌ 2):'}
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
                  setLevel(lvl.id);
                }}
                className={`py-2 px-1.5 rounded-xl transition text-center active:scale-95 cursor-pointer border ${
                  level === lvl.id
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

      {/* Right Column: Mission Card & Feedback */}
      <div className="w-full lg:flex-1 min-h-0 flex flex-col gap-2 shrink-1 overflow-hidden">
        {/* Score & Streak Header */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1 rounded-xl border border-amber-200 text-xs sm:text-sm font-black">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{lang === 'en' ? `Score: ${score}` : `النِّقَاطُ: ${score}`}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-xl border border-emerald-200 text-xs font-black animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>{streak} 🔥</span>
              </div>
            )}
          </div>

          <button
            onClick={() => loadNewChallenge(level)}
            className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition active:scale-95 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Another' : 'سُؤَالٌ آخَرُ'}</span>
          </button>
        </div>

        {/* The Mission Question Box */}
        {currentChallenge && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs border border-slate-200/80 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto app-scrollable-card">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-amber-800 font-black text-xs sm:text-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'en' ? 'MISSION:' : 'الْمُهِمَّةُ الْمَطْلُوبَةُ:'}</span>
                </div>

                <button
                  onClick={() => speakPrompt(currentChallenge.phoneticPrompt)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition border shadow-2xs cursor-pointer active:scale-95 ${
                    isSpeaking
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                  title={lang === 'en' ? 'Listen to question' : 'إِعَادَةُ نُطْقِ السُّؤَالِ صَوْتِيًّا'}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {isSpeaking
                      ? (lang === 'en' ? 'Speaking...' : 'جَارٍ النُّطْقُ...')
                      : (lang === 'en' ? 'Listen 🔊' : 'اسْتَمِعْ 🔊')}
                  </span>
                </button>
              </div>

              <div className={`text-lg sm:text-xl md:text-2xl font-black text-slate-950 leading-relaxed bg-amber-50/90 p-3 sm:p-4 rounded-2xl border border-amber-300 ${
                lang === 'en' ? 'text-left' : 'text-center sm:text-right'
              } font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]`}>
                {currentChallenge.promptText}
              </div>

              {/* Hint toggler */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowHint(!showHint);
                  }}
                  className="self-start flex items-center gap-1.5 text-xs font-black text-blue-700 hover:text-blue-900 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {showHint
                      ? (lang === 'en' ? 'Hide Hint' : 'إِخْفَاءُ التَّلْمِيحِ')
                      : (lang === 'en' ? 'Hint 💡' : 'تَلْمِيحٌ لِلْعَقَارِبِ 💡')}
                  </span>
                </button>

                {showHint && (
                  <div className="text-xs sm:text-sm font-bold text-blue-950 bg-blue-50 p-2.5 rounded-xl border border-blue-200 animate-fadeIn leading-relaxed">
                    💡 {currentChallenge.hintText}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Check Answer or Next */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 mt-2 shrink-0">
              {feedback === 'idle' && (
                <button
                  id="check-clock-answer-btn"
                  onClick={checkAnswer}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{lang === 'en' ? 'Check My Answer 🚀' : 'تَحَقَّقْ مِنْ إِجَابَتِي 🚀'}</span>
                </button>
              )}

              {feedback === 'correct' && (
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-400 font-black text-xs sm:text-sm animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'Awesome job! Perfect! 🎉 (+10 pts)'
                        : 'أَحْسَنْتَ يَا بَطَلُ! إِجَابَةٌ صَحِيحَةٌ 🎉 (+10 نِقَاطٍ)'}
                    </span>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>{lang === 'en' ? 'Next Question' : 'السُّؤَالُ التَّالِي'}</span>
                    {lang === 'en' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {feedback === 'wrong' && (
                <div className="w-full flex flex-col gap-2">
                  <div className="p-2.5 bg-rose-50 text-rose-950 rounded-xl border border-rose-400 font-bold text-xs">
                    <span>
                      {lang === 'en'
                        ? 'Try again! Check the red hour hand and blue minute hand carefully 🧐'
                        : 'حَاوِلْ مَرَّةً أُخْرَى! رَاقِبْ عَقْرَبَ السَّاعَاتِ وَعَقْرَبَ الدَّقَائِقِ 🧐'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={checkAnswer}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm transition cursor-pointer active:scale-95"
                    >
                      {lang === 'en' ? 'Re-check' : 'إِعَادَةُ التَّحَقُّقِ'}
                    </button>
                    <button
                      onClick={() => setShowHint(true)}
                      className="py-2 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-black text-xs sm:text-sm transition cursor-pointer active:scale-95 border border-blue-300"
                    >
                      {lang === 'en' ? 'Hint 💡' : 'تَلْمِيحٌ 💡'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

