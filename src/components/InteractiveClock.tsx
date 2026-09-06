import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getClockAngles, angleToMinutes, angleToHour } from '../utils/timeFormatters';
import { sounds } from '../utils/soundEffects';
import { Volume2 } from 'lucide-react';

interface InteractiveClockProps {
  hours: number; // 0-23
  minutes: number; // 0-59
  seconds?: number;
  interactive?: boolean;
  onChangeTime?: (hours: number, minutes: number) => void;
  showMinuteRing?: boolean;
  showFractionsOverlay?: boolean;
  showHandLabels?: boolean;
  size?: number;
  highlightTarget?: { hours: number; minutes: number } | null;
  lang?: 'en' | 'ar';
  onReadClock?: () => void;
}

export const InteractiveClock: React.FC<InteractiveClockProps> = ({
  hours,
  minutes,
  seconds = 0,
  interactive = true,
  onChangeTime,
  showMinuteRing = true,
  showFractionsOverlay = false,
  showHandLabels = true,
  size = 360,
  highlightTarget = null,
  lang = 'en',
  onReadClock,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingHand, setDraggingHand] = useState<'minute' | 'hour' | null>(null);

  const { hourAngle, minuteAngle, secondAngle } = getClockAngles(hours, minutes, seconds);

  const center = size / 2;
  const radius = size * 0.42;

  // Calculate pointer angle relative to center (0 deg is top / 12 o'clock)
  const getAngleFromEvent = useCallback(
    (clientX: number, clientY: number): number => {
      if (!svgRef.current) return 0;
      const rect = svgRef.current.getBoundingClientRect();
      const svgCenterX = rect.left + rect.width / 2;
      const svgCenterY = rect.top + rect.height / 2;

      const dx = clientX - svgCenterX;
      const dy = clientY - svgCenterY;

      // atan2 returns radians from positive X axis (3 o'clock).
      // Convert to degrees where 12 o'clock is 0 deg, clockwise.
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      return deg;
    },
    []
  );

  const handlePointerDown = (hand: 'minute' | 'hour', e: React.PointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDraggingHand(hand);
    sounds.playClick();
  };

  const handleClockFacePointerDown = (e: React.PointerEvent) => {
    if (!interactive || !onChangeTime) return;
    const angle = getAngleFromEvent(e.clientX, e.clientY);
    const newMinutes = angleToMinutes(angle, true);
    sounds.playTick();
    onChangeTime(hours, newMinutes);
    setDraggingHand('minute');
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingHand || !onChangeTime) return;
      const angle = getAngleFromEvent(e.clientX, e.clientY);

      if (draggingHand === 'minute') {
        const newMinutes = angleToMinutes(angle, false);
        if (newMinutes !== minutes) {
          // Detect hour crossing
          let newHours = hours;
          if (minutes >= 50 && newMinutes <= 10) {
            newHours = (hours + 1) % 24;
          } else if (minutes <= 10 && newMinutes >= 50) {
            newHours = (hours - 1 + 24) % 24;
          }
          sounds.playTick();
          onChangeTime(newHours, newMinutes);
        }
      } else if (draggingHand === 'hour') {
        const hour12 = angleToHour(angle);
        const isPm = hours >= 12;
        let newHours = isPm ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
        if (newHours !== hours) {
          sounds.playTick();
          onChangeTime(newHours, minutes);
        }
      }
    },
    [draggingHand, getAngleFromEvent, hours, minutes, onChangeTime]
  );

  const handlePointerUp = useCallback(() => {
    if (draggingHand) {
      setDraggingHand(null);
    }
  }, [draggingHand]);

  useEffect(() => {
    if (draggingHand) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [draggingHand, handlePointerMove, handlePointerUp]);

  // Numbers 1-12
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Colors
  const hourColor = '#DC2626'; // Red 600
  const minuteColor = '#2563EB'; // Blue 600
  const secondColor = '#D97706'; // Amber 600

  // 60 tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative select-none flex flex-col items-center justify-center p-1 w-full max-h-full flex-1 min-h-0 overflow-hidden">
      <svg
        id="interactive-clock-svg"
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: '100%',
          maxWidth: `${size}px`,
          maxHeight: 'clamp(170px, 36vh, 320px)',
          aspectRatio: '1 / 1',
        }}
        className="app-clock-svg touch-none cursor-pointer drop-shadow-md select-none"
        onPointerDown={handleClockFacePointerDown}
      >
        <defs>
          {/* Subtle 3D Rim Gradient */}
          <radialGradient id="clockFaceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>

          <radialGradient id="rimGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Hand Glow Filters */}
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="2" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Wooden / Golden Frame Rim */}
        <circle
          cx={center}
          cy={center}
          r={radius + 24}
          fill="url(#rimGrad)"
          stroke="#78350F"
          strokeWidth="3"
        />

        {/* Inner White Dial Face */}
        <circle
          cx={center}
          cy={center}
          r={radius + 12}
          fill="url(#clockFaceGrad)"
          stroke="#CBD5E1"
          strokeWidth="2"
        />

        {/* Fractions Overlay if enabled (القطاعات الملونة بدون كتابة ألفاظ) */}
        {showFractionsOverlay && (
          <g id="fractions-overlay" opacity="0.35">
            {/* Quarter past (0 to 15m) */}
            <path
              d={`M ${center} ${center} L ${center} ${center - radius + 8} A ${radius - 8} ${radius - 8} 0 0 1 ${center + radius - 8} ${center} Z`}
              fill="#FBBF24"
            />
            {/* Half past (0 to 30m) */}
            <path
              d={`M ${center} ${center} L ${center + radius - 8} ${center} A ${radius - 8} ${radius - 8} 0 0 1 ${center} ${center + radius - 8} Z`}
              fill="#34D399"
            />
            {/* Quarter to (45 to 60m) */}
            <path
              d={`M ${center} ${center} L ${center - radius + 8} ${center} A ${radius - 8} ${radius - 8} 0 0 1 ${center} ${center - radius + 8} Z`}
              fill="#F87171"
            />
          </g>
        )}

        {/* Minute & Hour Ticks */}
        {ticks.map((t) => {
          const angle = (t / 60) * 360;
          const isFiveMin = t % 5 === 0;
          const isQuarter = t % 15 === 0;
          const tickLength = isQuarter ? 14 : isFiveMin ? 10 : 5;
          const strokeWidth = isQuarter ? 3.5 : isFiveMin ? 2.5 : 1;
          const strokeColor = isQuarter ? '#1E293B' : isFiveMin ? '#475569' : '#94A3B8';

          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = center + (radius - tickLength) * Math.cos(rad);
          const y1 = center + (radius - tickLength) * Math.sin(rad);
          const x2 = center + radius * Math.cos(rad);
          const y2 = center + radius * Math.sin(rad);

          return (
            <line
              key={t}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}

        {/* 12-Hour Numbers (1 - 12) */}
        {numbers.map((num) => {
          const angle = (num / 12) * 360;
          const rad = ((angle - 90) * Math.PI) / 180;
          const numRadius = radius - 30;
          const nx = center + numRadius * Math.cos(rad);
          const ny = center + numRadius * Math.sin(rad);

          const isCurrentHour = (hours % 12 === 0 ? 12 : hours % 12) === num;

          return (
            <g
              key={`hour-${num}`}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                if (!interactive || !onChangeTime) return;
                const isPm = hours >= 12;
                const newH = isPm ? (num === 12 ? 12 : num + 12) : (num === 12 ? 0 : num);
                sounds.playTick();
                onChangeTime(newH, minutes);
              }}
            >
              {/* Optional highlight disc behind active hour */}
              {isCurrentHour && (
                <circle
                  cx={nx}
                  cy={ny}
                  r="19"
                  fill="#FEE2E2"
                  stroke="#DC2626"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}
              <text
                x={nx}
                y={ny + 8}
                textAnchor="middle"
                className={`font-black select-none ${
                  isCurrentHour ? 'fill-red-700 text-[26px]' : 'fill-slate-900 text-[24px]'
                }`}
                style={{ fontFamily: 'Fredoka, Baloo Bhaijaan 2, Tajawal, sans-serif' }}
              >
                {num}
              </text>
            </g>
          );
        })}

        {/* Outer Minute Ring (00, 05, 10, ..., 55) for 2nd Grade Learning */}
        {showMinuteRing &&
          numbers.map((num) => {
            const minVal = (num * 5) % 60;
            const minStr = minVal.toString().padStart(2, '0');
            const angle = (num / 12) * 360;
            const rad = ((angle - 90) * Math.PI) / 180;
            const ringRadius = radius + 9;
            const mx = center + ringRadius * Math.cos(rad);
            const my = center + ringRadius * Math.sin(rad);

            const isCurrentMinStep = Math.round(minutes / 5) * 5 % 60 === minVal;

            return (
              <g
                key={`min-ring-${minVal}`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!interactive || !onChangeTime) return;
                  sounds.playTick();
                  onChangeTime(hours, minVal);
                }}
              >
                <rect
                  x={mx - 16}
                  y={my - 10}
                  width="32"
                  height="20"
                  rx="10"
                  fill={isCurrentMinStep ? '#2563EB' : '#EFF6FF'}
                  stroke={isCurrentMinStep ? '#1D4ED8' : '#3B82F6'}
                  strokeWidth="1.5"
                />
                <text
                  x={mx}
                  y={my + 4.5}
                  textAnchor="middle"
                  className={`text-[12px] font-black select-none ${
                    isCurrentMinStep ? 'fill-white font-black' : 'fill-blue-800 font-black'
                  }`}
                  style={{ fontFamily: 'Fredoka, monospace' }}
                >
                  :{minStr}
                </text>
              </g>
            );
          })}

        {/* Ghost target indicator if in game mode */}
        {highlightTarget && (
          <g opacity="0.4" pointerEvents="none">
            {/* Target hour hand */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius * 0.55}
              stroke="#EF4444"
              strokeWidth="6"
              strokeDasharray="4 3"
              strokeLinecap="round"
              transform={`rotate(${getClockAngles(highlightTarget.hours, highlightTarget.minutes).hourAngle} ${center} ${center})`}
            />
            {/* Target minute hand */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius * 0.8}
              stroke="#3B82F6"
              strokeWidth="4"
              strokeDasharray="4 3"
              strokeLinecap="round"
              transform={`rotate(${getClockAngles(highlightTarget.hours, highlightTarget.minutes).minuteAngle} ${center} ${center})`}
            />
          </g>
        )}

        {/* ================= CLOCK HANDS ================= */}

        {/* 1. HOUR HAND (Short & Thick Red - عقرب الساعات) */}
        <g
          id="hour-hand-group"
          transform={`rotate(${hourAngle} ${center} ${center})`}
          className={interactive ? 'cursor-grab active:cursor-grabbing' : ''}
          filter="url(#handShadow)"
          onPointerDown={(e) => handlePointerDown('hour', e)}
        >
          {/* Main Hand Blade */}
          <polygon
            points={`
              ${center - 6},${center + 14}
              ${center - 5},${center - radius * 0.52}
              ${center},${center - radius * 0.58}
              ${center + 5},${center - radius * 0.52}
              ${center + 6},${center + 14}
            `}
            fill={hourColor}
            stroke="#991B1B"
            strokeWidth="1"
          />
          {/* Inner Accent Line */}
          <line
            x1={center}
            y1={center + 8}
            x2={center}
            y2={center - radius * 0.48}
            stroke="#FCA5A5"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Draggable Target Grip Ring */}
          {interactive && (
            <circle
              cx={center}
              cy={center - radius * 0.52}
              r="9"
              fill="#FFFFFF"
              stroke={hourColor}
              strokeWidth="2.5"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 2. MINUTE HAND (Long & Narrow Blue - عقرب الدقائق) */}
        <g
          id="minute-hand-group"
          transform={`rotate(${minuteAngle} ${center} ${center})`}
          className={interactive ? 'cursor-grab active:cursor-grabbing' : ''}
          filter="url(#handShadow)"
          onPointerDown={(e) => handlePointerDown('minute', e)}
        >
          {/* Main Hand Blade */}
          <polygon
            points={`
              ${center - 4},${center + 18}
              ${center - 3.5},${center - radius * 0.78}
              ${center},${center - radius * 0.86}
              ${center + 3.5},${center - radius * 0.78}
              ${center + 4},${center + 18}
            `}
            fill={minuteColor}
            stroke="#1E40AF"
            strokeWidth="1"
          />
          {/* Inner Accent Line */}
          <line
            x1={center}
            y1={center + 10}
            x2={center}
            y2={center - radius * 0.72}
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Draggable Target Grip Ring */}
          {interactive && (
            <circle
              cx={center}
              cy={center - radius * 0.78}
              r="10"
              fill="#FFFFFF"
              stroke={minuteColor}
              strokeWidth="2.5"
              className="animate-pulse"
            />
          )}
        </g>

        {/* 3. SECOND HAND (Thin Amber/Orange) */}
        {seconds !== undefined && (
          <g
            id="second-hand-group"
            transform={`rotate(${secondAngle} ${center} ${center})`}
            pointerEvents="none"
          >
            <line
              x1={center}
              y1={center + 24}
              x2={center}
              y2={center - radius * 0.88}
              stroke={secondColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx={center} cy={center - radius * 0.65} r="3.5" fill={secondColor} />
            <circle cx={center} cy={center + 16} r="4" fill={secondColor} />
          </g>
        )}

        {/* Central Cap Pin */}
        <circle cx={center} cy={center} r="9" fill="#1E293B" stroke="#F1F5F9" strokeWidth="2" />
        <circle cx={center} cy={center} r="3" fill="#F59E0B" />
      </svg>

      {/* Hand Color Indicator Badges & Aligned Digital Clock */}
      {showHandLabels && (
        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-xs font-black flex-wrap justify-center shrink-0">
          {/* Hour Hand Tag (عقرب الساعات - حجم مدمج بدون قصير أحمر) */}
          <div
            id="hour-hand-label-badge"
            className="flex items-center gap-1.5 bg-red-50 text-red-900 px-2.5 py-1 rounded-xl border border-red-200 shadow-2xs"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
            <span className="truncate">{lang === 'en' ? 'Hour Hand' : 'عَقْرَبُ السَّاعَاتِ'}</span>
          </div>

          {/* Digital Clock Aligned in between the hand badges (الساعة الرقمية بمحاذاة زري العقربين) */}
          <div
            id="clock-aligned-digital-display"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-slate-950 text-white rounded-xl font-mono shadow-xs border border-slate-800"
          >
            <span className="text-[11px] text-amber-300 font-bold hidden sm:inline">
              {lang === 'en' ? 'Digital:' : 'السَّاعَةُ:'}
            </span>
            <span className="text-sm sm:text-base font-black text-amber-400 tracking-wider">
              {`${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}
            </span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
              {lang === 'en' ? (hours >= 12 ? 'PM' : 'AM') : (hours >= 12 ? 'م' : 'ص')}
            </span>
            {onReadClock && (
              <button
                type="button"
                onClick={onReadClock}
                className="p-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer active:scale-95 ml-0.5"
                title={lang === 'en' ? 'Read Clock' : 'قِرَاءَةُ السَّاعَةِ'}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Minute Hand Tag (عقرب الدقائق - حجم مدمج بدون طويل أزرق) */}
          <div
            id="minute-hand-label-badge"
            className="flex items-center gap-1.5 bg-blue-50 text-blue-900 px-2.5 py-1 rounded-xl border border-blue-200 shadow-2xs"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
            <span className="truncate">{lang === 'en' ? 'Minute Hand' : 'عَقْرَبُ الدَّقَائِقِ'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

