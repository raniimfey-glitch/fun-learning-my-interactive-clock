// Web Audio API Sound Synthesizer & Bilingual (Arabic / English) Text-to-Speech Engine for Kids
import { Language } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private cachedArabicVoice: SpeechSynthesisVoice | null = null;
  private cachedEnglishVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voicesLoaded = true;

        // 1. Prioritize natural sounding Arabic voices
        const preferredArLocales = ['ar-SA', 'ar-EG', 'ar-AE', 'ar-QA', 'ar-DZ', 'ar-MA', 'ar'];
        let selectedAr: SpeechSynthesisVoice | null = null;
        for (const loc of preferredArLocales) {
          const match = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase()));
          if (match) {
            selectedAr = match;
            break;
          }
        }
        if (!selectedAr) {
          selectedAr = voices.find((v) => v.lang.toLowerCase().startsWith('ar')) || null;
        }
        this.cachedArabicVoice = selectedAr;

        // 2. Prioritize natural, friendly English voices (US, GB, child/female friendly)
        const preferredEnLocales = ['en-US', 'en-GB', 'en-CA', 'en-AU', 'en'];
        let selectedEn: SpeechSynthesisVoice | null = null;
        for (const loc of preferredEnLocales) {
          const match = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase()));
          if (match) {
            selectedEn = match;
            break;
          }
        }
        if (!selectedEn) {
          selectedEn = voices.find((v) => v.lang.toLowerCase().startsWith('en')) || null;
        }
        this.cachedEnglishVoice = selectedEn;
      }
    } catch {
      // Ignore
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  playTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Ignore audio errors
    }
  }

  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Ignore audio errors
    }
  }

  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.2, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.36);
      });
    } catch {
      // Ignore
    }
  }

  playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignore
    }
  }

  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.12 }, // C
        { f: 659.25, d: 0.12 }, // E
        { f: 783.99, d: 0.12 }, // G
        { f: 1046.5, d: 0.35 }, // C (high)
      ];
      let t = now;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + note.d + 0.01);
        t += note.d + 0.04;
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Slow, clear, child-friendly English Text-to-Speech
   */
  speakEnglish(text: string, onEnd?: () => void) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.80; // Slower, kid-friendly pace for clear listening and comprehension
      utterance.pitch = 1.05; // Friendly, encouraging child tone

      if (!this.cachedEnglishVoice) {
        this.initVoices();
      }

      if (this.cachedEnglishVoice) {
        utterance.voice = this.cachedEnglishVoice;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  /**
   * High quality Arabic speech synthesizer for 2nd Grade kids.
   */
  speakArabic(text: string, onEnd?: () => void) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;

      if (!this.cachedArabicVoice) {
        this.initVoices();
      }

      if (this.cachedArabicVoice) {
        utterance.voice = this.cachedArabicVoice;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  speak(text: string, lang: Language = 'en', onEnd?: () => void) {
    if (lang === 'en') {
      this.speakEnglish(text, onEnd);
    } else {
      this.speakArabic(text, onEnd);
    }
  }

  speakCheer(correct: boolean, lang: Language = 'en') {
    if (lang === 'en') {
      if (correct) {
        const cheers = [
          'Awesome job! That is completely correct!',
          'Great work! You are a clock master!',
          'Excellent! You got the right time!',
          'Super star! That is spot on!',
        ];
        const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
        this.speakEnglish(randomCheer);
      } else {
        const encouragements = [
          'Good try! Look closely at the short hour hand and long minute hand.',
          'Take another look, and try once more!',
          'Almost there! Check the positions of the red and blue hands.',
        ];
        const randomEnc = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.speakEnglish(randomEnc);
      }
    } else {
      if (correct) {
        const cheers = [
          'أَحْسَنْتَ يَا بَطَلُ! إِجَابَةٌ صَحِيحَةٌ وَمُمَيَّزَةٌ!',
          'مُمْتَازٌ! عَمَلٌ رَائِعٌ جِدًّا!',
          'بَارَكَ اللَّهُ فِيكَ! أَجَبْتَ بِشَكْلٍ صَحِيحٍ!',
          'أَحْسَنْتِ يَا بَطَلَةُ! إِجَابَةٌ دَقِيقَةٌ وَمُتْقَنَةٌ!',
        ];
        const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
        this.speakArabic(randomCheer);
      } else {
        const encouragements = [
          'حَاوِلْ مَرَّةً أُخْرَى بِتَرْكِيزٍ! اُنْظُرْ إِلَى مَكَانِ عَقْرَبِ السَّاعَاتِ وَعَقْرَبِ الدَّقَائِقِ.',
          'رَكِّزْ جَيِّدًا يَا صَغِيرِي، ثُمَّ حَاوِلْ مَرَّةً أُخْرَى.',
          'لَا بَأْسَ، تَأَكَّدْ مِنْ مَوْقِعِ عَقْرَبِ السَّاعَاتِ وَعَقْرَبِ الدَّقَائِقِ.',
        ];
        const randomEnc = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.speakArabic(randomEnc);
      }
    }
  }
}

export const sounds = new SoundEngine();

