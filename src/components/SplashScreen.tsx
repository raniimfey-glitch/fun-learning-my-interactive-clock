import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Language } from '../types';

interface SplashScreenProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  autoCloseDelay?: number; // in milliseconds, defaults to 3500ms
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
  autoCloseDelay = 3500,
}) => {
  const [activeDot, setActiveDot] = useState<number>(0);

  // Cycle the loading / indicator dots smoothly
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 600);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-close timer if specified
  useEffect(() => {
    if (!isOpen || autoCloseDelay <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDelay, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="splash-overlay"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 w-full h-full min-h-screen flex flex-col justify-between items-center select-none overflow-hidden cursor-pointer"
          style={{
            background: 'radial-gradient(circle at 50% 40%, #fef3c7 0%, #fde68a 30%, #f59e0b 75%, #d97706 100%)',
          }}
          onClick={onClose}
        >
          {/* Ambient Glowing Radial Lights in background */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full bg-white/45 blur-3xl pointer-events-none" />
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[360px] h-[260px] sm:h-[360px] rounded-full bg-amber-200/70 blur-2xl pointer-events-none" />

          {/* Decorative ambient blurred blobs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-800/15 blur-3xl pointer-events-none" />

          {/* Top Spacing Area (No Skip Button) */}
          <div className="w-full h-8 sm:h-12" />

          {/* Main Central Content Area */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 sm:px-6 w-full max-w-xl text-center">
            {/* Animated App Icon Wrapper */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              }}
              className="relative"
            >
              {/* Flashing Outer Ambient Glow (خلفية الايقونة وامضة) */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.35, 1, 0.35],
                  filter: [
                    'blur(22px) brightness(1)',
                    'blur(34px) brightness(1.75)',
                    'blur(22px) brightness(1)',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-7 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 rounded-[46px] pointer-events-none"
              />

              {/* Flashing Rim Border Highlight (وميض الحواف) */}
              <motion.div
                animate={{
                  opacity: [0.45, 1, 0.45],
                  boxShadow: [
                    '0 0 18px 3px rgba(245, 158, 11, 0.4)',
                    '0 0 45px 14px rgba(251, 191, 36, 0.95)',
                    '0 0 18px 3px rgba(245, 158, 11, 0.4)',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-1 rounded-[30px] sm:rounded-[36px] bg-gradient-to-tr from-yellow-200 via-amber-300 to-white pointer-events-none"
              />

              {/* Floating Twinkling Stars around Icon */}
              <motion.div
                animate={{
                  scale: [0.8, 1.3, 0.8],
                  rotate: [0, 25, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute -top-3 -right-3 z-20 text-yellow-200 pointer-events-none drop-shadow-md"
              >
                <Sparkles className="w-8 h-8 fill-yellow-200 text-yellow-100" />
              </motion.div>

              <motion.div
                animate={{
                  scale: [1.2, 0.8, 1.2],
                  rotate: [0, -30, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', delay: 0.3 }}
                className="absolute -bottom-2 -left-3 z-20 text-amber-200 pointer-events-none drop-shadow-md"
              >
                <Sparkles className="w-6 h-6 fill-amber-200 text-amber-100" />
              </motion.div>

              {/* Rounded-square App Icon Box with Animated Clock SVG */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-[28px] sm:rounded-[34px] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1.5 shadow-[0_20px_50px_rgba(180,83,9,0.38)] border-4 border-white/80 flex items-center justify-center overflow-hidden">
                {/* SVG Animated Clock Graphic */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-full h-full select-none"
                >
                  <defs>
                    <linearGradient id="splashBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="splashRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#fef3c7" />
                    </linearGradient>
                    <filter id="splashDropShadow" x="-10%" y="-10%" width="130%" height="130%">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.2" />
                    </filter>
                    <filter id="splashHandShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Squircle Base with subtle flashing opacity */}
                  <rect width="512" height="512" rx="100" fill="url(#splashBgGrad)">
                    <animate
                      attributeName="opacity"
                      values="0.9;1;0.9"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect x="16" y="16" width="480" height="480" rx="88" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="6" />

                  {/* Clock Outer Rim */}
                  <circle cx="256" cy="256" r="192" fill="#fed7aa" filter="url(#splashDropShadow)" />
                  <circle cx="256" cy="256" r="182" fill="url(#splashRimGrad)" stroke="#fbbf24" strokeWidth="10" />

                  {/* Star Sparkles inside face */}
                  <path d="M100 80 Q105 100 125 105 Q105 110 100 130 Q95 110 75 105 Q95 100 100 80 Z" fill="#ffffff" opacity="0.9" />
                  <path d="M420 90 Q424 105 440 108 Q424 112 420 128 Q416 112 400 108 Q416 105 420 90 Z" fill="#ffffff" opacity="0.9" />

                  {/* Dial Numbers */}
                  <text x="256" y="125" fontFamily="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" fontSize="38" fontWeight="900" fill="#1e293b" textAnchor="middle">12</text>
                  <text x="390" y="267" fontFamily="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" fontSize="38" fontWeight="900" fill="#1e293b" textAnchor="middle">3</text>
                  <text x="256" y="410" fontFamily="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" fontSize="38" fontWeight="900" fill="#1e293b" textAnchor="middle">6</text>
                  <text x="122" y="267" fontFamily="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" fontSize="38" fontWeight="900" fill="#1e293b" textAnchor="middle">9</text>

                  {/* Hour Marker Dots */}
                  <circle cx="328" cy="132" r="7" fill="#64748b" />
                  <circle cx="380" cy="184" r="7" fill="#64748b" />
                  <circle cx="380" cy="328" r="7" fill="#64748b" />
                  <circle cx="328" cy="380" r="7" fill="#64748b" />
                  <circle cx="184" cy="380" r="7" fill="#64748b" />
                  <circle cx="132" cy="328" r="7" fill="#64748b" />
                  <circle cx="132" cy="184" r="7" fill="#64748b" />
                  <circle cx="184" cy="132" r="7" fill="#64748b" />

                  {/* ANIMATED CLOCK HANDS - Firmly Anchored at Center (256, 256) */}
                  {/* Hour Hand: Red, Smooth Rotating Clockwise around (256, 256) */}
                  <g filter="url(#splashHandShadow)">
                    <line x1="256" y1="256" x2="256" y2="160" stroke="#dc2626" strokeWidth="18" strokeLinecap="round" />
                    <circle cx="256" cy="160" r="5" fill="#ef4444" />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 256 256"
                      to="360 256 256"
                      dur="12s"
                      repeatCount="indefinite"
                    />
                  </g>

                  {/* Minute Hand: Sky-Blue, Smooth Rotating Clockwise around (256, 256) */}
                  <g filter="url(#splashHandShadow)">
                    <line x1="256" y1="256" x2="256" y2="110" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" />
                    <circle cx="256" cy="110" r="4" fill="#38bdf8" />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 256 256"
                      to="360 256 256"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </g>

                  {/* Second Hand: Slim orange pointer smoothly sweeping around (256, 256) */}
                  <g>
                    <line x1="256" y1="280" x2="256" y2="92" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="256" cy="92" r="5" fill="#ea580c" />
                    <circle cx="256" cy="280" r="4" fill="#ea580c" />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 256 256"
                      to="360 256 256"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </g>

                  {/* Center Hub - Pinned on top of hands */}
                  <circle cx="256" cy="256" r="22" fill="#d97706" />
                  <circle cx="256" cy="256" r="14" fill="#fbbf24" />
                  <circle cx="256" cy="256" r="6" fill="#ffffff" />
                </svg>
              </div>
            </motion.div>

            {/* Typography Centered Below Icon */}
            <div className="mt-8 sm:mt-10 space-y-3">
              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight drop-shadow-sm font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]">
                {lang === 'en' ? 'My Interactive Clock' : 'سَاعَتِي التَّفَاعُلِيَّة'}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl font-bold text-amber-900/90 max-w-md mx-auto leading-relaxed font-['Tajawal',sans-serif]">
                {lang === 'en'
                  ? 'Fun learning to read and set the clock with sounds and quizzes'
                  : 'التَّعَلُّمُ الْمُمْتِعُ لِقِرَاءَةِ وَضَبْطِ السَّاعَةِ'}
              </p>

              {/* Requested Text Directly Under Subtitle: ✨️ التّعلّم الممتِع - رنيم فاي ✨️ */}
              <div className="pt-2 flex justify-center">
                <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border-2 border-amber-300 shadow-md text-amber-950 font-black text-sm sm:text-base md:text-lg tracking-wide select-none">
                  <span className="text-amber-500 text-lg">✨️</span>
                  <span>التّعلّم الممتِع - رنيم فاي</span>
                  <span className="text-amber-500 text-lg">✨️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: Loading Indicators */}
          <div className="relative z-10 w-full max-w-md px-6 pb-8 sm:pb-10 pt-2 flex flex-col items-center gap-4">
            {/* Indicators: Three round navigation / loading dots */}
            <div className="flex items-center gap-2 pt-1">
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeDot === 0
                    ? 'w-7 bg-amber-950'
                    : 'w-2.5 bg-amber-950/25'
                }`}
              />
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeDot === 1
                    ? 'w-7 bg-amber-950'
                    : 'w-2.5 bg-amber-950/25'
                }`}
              />
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeDot === 2
                    ? 'w-7 bg-amber-950'
                    : 'w-2.5 bg-amber-950/25'
                }`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
