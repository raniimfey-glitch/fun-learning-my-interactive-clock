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
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Clock to Adjust */}
      <div className="w-full lg:w-[460px] bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/80 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-sm font-black text-slate-700 mb-2 flex-wrap gap-2">
          <span className="text-amber-800">
            {lang === 'en' ? 'Drag the hands to match target 🎯' : 'حَرِّكِ الْعَقَارِبَ لِتُطَابِقَ الْمَطْلُوبَ 🎯'}
          </span>
          <span className="font-mono bg-slate-100 px-3 py-1 rounded-xl text-slate-900 font-black border border-slate-200">
            {lang === 'en' ? `Clock is at: ${userDigital.time12}` : `السَّاعَةُ الْآنَ: ${userDigital.time12} (${userSpoken})`}
          </span>
        </div>

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
          size={340}
          lang={lang}
        />

        {/* Level Selector */}
        <div className="w-full mt-4 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="text-sm font-black text-slate-700">
            {lang === 'en' ? 'Choose Challenge Level:' : 'اِخْتَرْ مُسْتَوَى التَّحَدِّي (السَّنَةُ الثَّانِيَةُ):'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm font-black">
            {[
              { id: 1, label: lang === 'en' ? "Level 1: O'clock (:00) & Half (:30)" : 'مُسْتَوًى 1: تَمَامًا (:00) وَنِصْفٌ (:30)' },
              { id: 2, label: lang === 'en' ? 'Level 2: Quarters (:15, :45)' : 'مُسْتَوًى 2: وَالرُّبْعُ (:15) وَإِلَّا رُبْعًا (:45)' },
              { id: 3, label: lang === 'en' ? 'Level 3: Every 5 Mins & Thirds' : 'مُسْتَوًى 3: كُلُّ 5 دَقَائِقَ وَالْأَثْلَاثُ' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  sounds.playClick();
                  setLevel(lvl.id);
                }}
                className={`py-3 px-3 rounded-2xl transition text-center active:scale-95 cursor-pointer border-2 ${
                  level === lvl.id
                    ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Mission Card & Feedback */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        {/* Score & Streak Header */}
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-4 py-2 rounded-2xl border-2 border-amber-200 text-base font-black">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>{lang === 'en' ? `Score: ${score}` : `النِّقَاطُ: ${score}`}</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-2 rounded-2xl border-2 border-emerald-200 text-base font-black animate-pulse">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>{lang === 'en' ? `Streak: ${streak} in a row! 🔥` : `إِجَابَاتٌ مُتَتَالِيَةٌ: ${streak} 🔥`}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => loadNewChallenge(level)}
            className="flex items-center gap-2 text-sm font-black text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-2xl transition active:scale-95 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'en' ? 'Another Question' : 'سُؤَالٌ آخَرُ'}</span>
          </button>
        </div>

        {/* The Mission Question Box */}
        {currentChallenge && (
          <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-slate-200/80 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-amber-800 font-black text-base md:text-lg">
                <Award className="w-6 h-6 text-amber-600" />
                <span>{lang === 'en' ? 'YOUR MISSION:' : 'الْمُهِمَّةُ الْمَطْلُوبَةُ:'}</span>
              </div>

              <button
                onClick={() => speakPrompt(currentChallenge.phoneticPrompt)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black transition border-2 shadow-xs cursor-pointer active:scale-95 ${
                  isSpeaking
                    ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
                title={lang === 'en' ? 'Listen to question' : 'إِعَادَةُ نُطْقِ السُّؤَالِ صَوْتِيًّا'}
              >
                <Volume2 className="w-5 h-5" />
                <span>
                  {isSpeaking
                    ? (lang === 'en' ? 'Speaking...' : 'جَارٍ النُّطْقُ...')
                    : (lang === 'en' ? 'Listen 🔊' : 'اِسْتَمِعْ لِلسُّؤَالِ 🔊')}
                </span>
              </button>
            </div>

            <div className={`text-2xl md:text-3xl font-black text-slate-950 leading-relaxed bg-amber-50/90 p-6 rounded-3xl border-2 border-amber-300 ${
              lang === 'en' ? 'text-left' : 'text-center sm:text-right'
            } font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]`}>
              {currentChallenge.promptText}
            </div>

            {/* Hint toggler */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHint(!showHint);
                }}
                className="self-start flex items-center gap-2 text-sm font-black text-blue-700 hover:text-blue-900 cursor-pointer bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200"
              >
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>
                  {showHint
                    ? (lang === 'en' ? 'Hide Hint' : 'إِخْفَاءُ التَّلْمِيحِ')
                    : (lang === 'en' ? 'Show Hand Positions Hint 💡' : 'أَحْتَاجُ تَلْمِيحًا لِمَكَانِ الْعَقَارِبِ 💡')}
                </span>
              </button>

              {showHint && (
                <div className="text-base font-bold text-blue-950 bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 animate-fadeIn leading-relaxed">
                  💡 {currentChallenge.hintText}
                </div>
              )}
            </div>

            {/* Action Buttons: Check Answer or Next */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {feedback === 'idle' && (
                <button
                  id="check-clock-answer-btn"
                  onClick={checkAnswer}
                  className="flex-1 py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-black text-lg md:text-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>{lang === 'en' ? 'Check My Answer 🚀' : 'تَحَقَّقْ مِنْ إِجَابَتِي 🚀'}</span>
                </button>
              )}

              {feedback === 'correct' && (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-950 rounded-2xl border-2 border-emerald-400 font-black text-base md:text-lg animate-bounce">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'Awesome job superstar! Perfect clock match! 🎉 (+10 pts)'
                        : 'أَحْسَنْتَ يَا بَطَلُ! إِجَابَةٌ صَحِيحَةٌ تَمَامًا 🎉 (+10 نِقَاطٍ)'}
                    </span>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg md:text-xl shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                  >
                    <span>{lang === 'en' ? 'Next Question' : 'السُّؤَالُ التَّالِي'}</span>
                    {lang === 'en' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                  </button>
                </div>
              )}

              {feedback === 'wrong' && (
                <div className="w-full flex flex-col gap-3">
                  <div className="p-4 bg-rose-50 text-rose-950 rounded-2xl border-2 border-rose-400 font-bold text-base">
                    <span>
                      {lang === 'en'
                        ? 'Try again! Check the red hour hand and blue minute hand positions carefully 🧐'
                        : 'حَاوِلْ مَرَّةً أُخْرَى! اُنْظُرْ إِلَى مَكَانِ عَقْرَبِ السَّاعَاتِ (الْأَحْمَرِ) وَعَقْرَبِ الدَّقَائِقِ (الْأَزْرَقِ) جَيِّدًا 🧐'}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={checkAnswer}
                      className="flex-1 py-4 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base transition cursor-pointer active:scale-95"
                    >
                      {lang === 'en' ? 'Re-check' : 'إِعَادَةُ التَّحَقُّقِ'}
                    </button>
                    <button
                      onClick={() => setShowHint(true)}
                      className="py-4 px-5 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-black text-base transition cursor-pointer active:scale-95 border border-blue-300"
                    >
                      {lang === 'en' ? 'Show Hint 💡' : 'عَرْضُ التَّلْمِيحِ 💡'}
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

