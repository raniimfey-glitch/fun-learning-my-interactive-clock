import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, X } from 'lucide-react';
import { Language } from '../types';

interface SplashScreenProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  autoCloseDelay?: number; // in milliseconds, or 0 to disable auto close
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isOpen,
  onClose,
  lang = 'ar',
  autoCloseDelay = 0,
}) => {
  const [activeDot, setActiveDot] = useState<number>(0);

  // Cycle the loading / indicator dots smoothly
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Optional auto-close timer if specified
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
        >
          {/* Mobile Mockup Card with 9:16 Aspect Ratio */}
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[390px] aspect-[9/16] max-h-[92vh] rounded-[36px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-4 border-amber-200/50 flex flex-col justify-between text-slate-900 select-none"
            style={{
              background: 'radial-gradient(circle at 50% 32%, #fef3c7 0%, #fde68a 35%, #f59e0b 80%, #d97706 100%)',
            }}
          >
            {/* Ambient Glowing Radial Light centered behind the icon */}
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/40 blur-3xl pointer-events-none" />
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-200/60 blur-xl pointer-events-none" />

            {/* Subtle background decorative shapes */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-700/15 blur-2xl pointer-events-none" />

            {/* Top Bar: Close / Skip Button */}
            <div className="relative z-10 w-full px-6 pt-5 flex items-center justify-between">
              {/* Subtle Mobile Speaker Notch Mockup */}
              <div className="w-20 h-1.5 bg-amber-900/20 rounded-full mx-auto" />
              <button
                type="button"
                onClick={onClose}
                className="absolute left-5 top-4 p-2 rounded-full bg-white/40 hover:bg-white/70 text-amber-950 transition active:scale-95 shadow-xs cursor-pointer"
                title={lang === 'en' ? 'Close / Skip' : 'إِغْلَاقٌ / تَخَطٍّ'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upper-Middle Area: Centered App Icon with Ambient Glow */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 -mt-2">
              <motion.div
                initial={{ scale: 0.8, rotate: -6 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1, damping: 18 }}
                className="relative group cursor-pointer"
                onClick={onClose}
              >
                {/* Outer Ambient Glow matching theme */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-[28px] blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />

                {/* Rounded-square App Icon (border-radius: 20px) */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[24px] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-2xl border-2 border-white/60 flex items-center justify-center overflow-hidden">
                  {/* High-Resolution Clock Graphics */}
                  <img
                    src="/icon-512.png"
                    alt="ساعتي التفاعلية"
                    className="w-full h-full object-cover rounded-[20px]"
                    onError={(e) => {
                      // Fallback to SVG if PNG fails
                      (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                    }}
                  />
                </div>
              </motion.div>

              {/* Typography Centered Below Icon */}
              <div className="mt-7 text-center space-y-2">
                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight drop-shadow-sm font-['Baloo_Bhaijaan_2','Tajawal',sans-serif]"
                >
                  {lang === 'en' ? 'My Interactive Clock' : 'سَاعَتِي التَّفَاعُلِيَّة'}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base font-bold text-amber-900/90 max-w-[260px] mx-auto leading-snug font-['Tajawal',sans-serif]"
                >
                  {lang === 'en'
                    ? 'Fun learning to read and set the clock with sounds and quizzes'
                    : 'التَّعَلُّمُ الْمُمْتِعُ لِقِرَاءَةِ وَضَبْطِ السَّاعَةِ'}
                </motion.p>
              </div>

              {/* Action Call to Enter */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-black shadow-lg shadow-amber-900/20 border-2 border-white/80 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-base cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-amber-600 text-amber-600" />
                  <span>{lang === 'en' ? 'Start Exploring' : 'اِبْدَأِ التَّعَلُّمَ'}</span>
                </button>
              </motion.div>
            </div>

            {/* Bottom Area: Branding Pill & Indicators */}
            <div className="relative z-10 w-full px-6 pb-6 pt-2 flex flex-col items-center gap-4">
              {/* Branding Pill: "✨ رنيم فاي | التّعلّم الممتِع ✨" */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-amber-300/80 shadow-xs text-amber-950 font-black text-xs sm:text-sm tracking-wide"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                <span>رنيم فاي | التّعلّم الممتِع</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              </motion.div>

              {/* Indicators: Three small round navigation / loading dots */}
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeDot === 0
                      ? 'w-6 bg-amber-900'
                      : 'w-2 bg-amber-900/30'
                  }`}
                />
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeDot === 1
                      ? 'w-6 bg-amber-900'
                      : 'w-2 bg-amber-900/30'
                  }`}
                />
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeDot === 2
                      ? 'w-6 bg-amber-900'
                      : 'w-2 bg-amber-900/30'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
