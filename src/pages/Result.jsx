import { useState, useRef } from "react";
import {
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Palette,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const StockChartIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="stockGrad" x1="0" x2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <path d="M4 20h16" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M4 4v16" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 20v-1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M11 20v-1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M15 20v-1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M19 20v-1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round" />
    <path
      d="M5 16 C8 12,10 13,13 12 C15.5 11,16.5 9.5,19 8"
      stroke="url(#stockGrad)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M5 16 C8 12,10 13,13 12 C15.5 11,16.5 9.5,19 8 L19 20 L5 20 Z" fill="#ffffff" opacity="0.06" />
    <path d="M16 6 L19 8 L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const StockChartLarge = (props) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="largeGrad" x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.98" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <g stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.8">
      <path d="M8 8 H56" />
      <path d="M8 18 H56" />
      <path d="M8 28 H56" />
      <path d="M8 38 H56" />
      <path d="M8 48 H56" />
      <path d="M16 8 V56" />
      <path d="M28 8 V56" />
      <path d="M40 8 V56" />
      <path d="M52 8 V56" />
    </g>
    <path d="M8 56 H56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 8 V56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <text x="6" y="6" fontSize="6" fill="currentColor" opacity="0.6">y</text>
    <text x="58" y="60" fontSize="6" fill="currentColor" opacity="0.6">x</text>
    <polygon points="10,44 16,36 22,42 30,34 36,31 42,28 50,20 50,56 10,56" fill="currentColor" opacity="0.035" />
    <polyline
      points="10,44 16,36 22,42 30,34 36,31 42,28 50,20"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeOpacity={1}
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M46 17 L50 20 L46 23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MoneyEmoji = ({ className = "", ...props }) => (
  <span
    aria-hidden="true"
    className={`${className} inline-flex items-center justify-center`}
    style={{ fontSize: "2.5rem", lineHeight: 1 }}
    {...props}
  >
    💵
  </span>
);

const hexToRgb = (hex) => {
  const fallback = { r: 43, g: 39, b: 75 };
  if (!hex) return fallback;

  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  if (normalized.length !== 6) return fallback;

  const number = Number.parseInt(normalized, 16);
  if (Number.isNaN(number)) return fallback;

  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
};

const DEPT_META = {
  eb: {
    Icon: BriefcaseBusiness,
    type: "아이디어를 현실적인 비즈니스로 키우는 타입",
  },
  dc: {
    Icon: Palette,
    type: "보이는 경험을 멋지게 설계하는 타입",
  },
  wp: {
    Icon: Code2,
    type: "상상을 바로 서비스로 구현하는 타입",
  },
  hs: {
    Icon: ShieldCheck,
    type: "허점을 찾고 단단하게 만드는 타입",
  },
};

export default function Result({ dept, onRestart }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const cardRef = useRef(null);
  const pointerRef = useRef({
    isDown: false,
    moved: false,
    pointerType: "mouse",
    startX: 0,
    startY: 0,
  });

  const applyDragTilt = (clientX, clientY, strength) => {
    if (!cardRef.current) return;
    const card = cardRef.current.getBoundingClientRect();
    const pointer = pointerRef.current;

    const deltaX = clientX - pointer.startX;
    const deltaY = clientY - pointer.startY;
    const ratioX = deltaX / (card.width * 0.42);
    const ratioY = deltaY / (card.height * 0.42);

    const rotateX = Math.max(Math.min(ratioY * -strength, strength), -strength);
    const rotateY = Math.max(Math.min(ratioX * strength, strength), -strength);

    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handlePointerDown = (e) => {
    setIsInteracting(true);
    setHasInteracted(true);
    pointerRef.current = {
      isDown: true,
      moved: false,
      pointerType: e.pointerType,
      startX: e.clientX,
      startY: e.clientY,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    resetTilt();
  };

  const handlePointerMove = (e) => {
    const pointer = pointerRef.current;

    if (pointer.isDown) {
      const distance = Math.hypot(e.clientX - pointer.startX, e.clientY - pointer.startY);
      if (distance > 10) pointer.moved = true;
    }

    if (pointer.isDown) {
      applyDragTilt(e.clientX, e.clientY, e.pointerType === "mouse" ? 14 : 18);
    }
  };

  const handlePointerUp = (e) => {
    const pointer = pointerRef.current;
    const distance = Math.hypot(e.clientX - pointer.startX, e.clientY - pointer.startY);
    const shouldFlip = pointer.isDown && !pointer.moved && distance < 10;

    pointerRef.current = {
      ...pointer,
      isDown: false,
    };
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setIsInteracting(false);
    resetTilt();

    if (shouldFlip) {
      setIsFlipped((prev) => !prev);
    }
  };

  const handlePointerLeave = () => {
    if (!pointerRef.current.isDown) {
      setIsInteracting(false);
      resetTilt();
    }
  };

  const handlePointerCancel = () => {
    pointerRef.current.isDown = false;
    setIsInteracting(false);
    resetTilt();
  };

  const isTilting = Math.abs(tilt.x) > 0.01 || Math.abs(tilt.y) > 0.01;
  const shouldIdleAnimate = !hasInteracted && !isInteracting && !isTilting;
  const deptColor = hexToRgb(dept?.color);
  const deptGlass = `rgba(${deptColor.r}, ${deptColor.g}, ${deptColor.b}, 0.68)`;
  const deptGlassDeep = `rgba(${Math.max(deptColor.r - 34, 0)}, ${Math.max(
    deptColor.g - 34,
    0,
  )}, ${Math.max(deptColor.b - 34, 0)}, 0.78)`;
  const deptMeta = DEPT_META[dept?.id] || DEPT_META.wp;
  const DeptIcon = deptMeta.Icon;

  return (
    <main className="min-h-dvh bg-[#F9FAFB] text-[#333D4B]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-5 pb-5 pt-6 select-none">
        <header className="w-full">
          <p className="text-[13px] font-bold text-[#524b9b]">결과가 나왔어요</p>
          <h2 className="mt-2.5 text-[28px] font-black leading-tight tracking-normal text-[#191F28]">
            당신에게 딱 맞는
            <br />
            디미고 학과는?
          </h2>
        </header>
        <section
          className="result-card-enter relative mx-auto my-6 w-full max-w-[300px] aspect-[3/4.18]"
          style={{ perspective: "1500px" }}
        >
          {!hasInteracted && (
            <div className="pointer-events-none absolute -left-8 -right-8 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-1 text-[#524b9b]/55">
              <span className="swipe-hint-left text-[30px] font-black leading-none">‹</span>
              <span className="swipe-hint-right text-[30px] font-black leading-none">›</span>
            </div>
          )}
          <div
            ref={cardRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerCancel}
            className={`h-full w-full cursor-grab touch-none transition-transform will-change-transform active:cursor-grabbing ${
              shouldIdleAnimate ? "card-idle-demo" : ""
            }`}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate3d(${tilt.y * 0.35}px, ${-tilt.x * 0.22}px, 0)`,
              transitionDuration: isTilting ? "34ms" : "620ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
          >
            <div 
              className="relative h-full w-full rounded-[30px] shadow-[0_26px_70px_rgba(15,23,42,0.24)] transition-transform duration-[850ms] will-change-transform"
              style={{ 
                transformStyle: "preserve-3d", 
                WebkitTransformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div 
                className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[30px] p-6 text-left text-white"
                style={{ 
                  background: `linear-gradient(145deg, ${deptGlass} 0%, ${deptGlass} 52%, ${deptGlassDeep} 100%)`,
                  backdropFilter: "blur(22px) saturate(148%)",
                  WebkitBackdropFilter: "blur(22px) saturate(148%)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-24px_48px_rgba(0,0,0,0.16)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.14)_32%,transparent_64%)]" />
                <div className="pointer-events-none absolute -left-12 top-0 h-2/3 w-24 rotate-[18deg] bg-white/30 blur-xl" />
                <DeptIcon
                  aria-hidden="true"
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 text-white opacity-80"
                  style={{ top: "38%" }}
                />
                
                <div className="relative z-10">
                  <h3 className="result-stagger-1 mt-2 text-[31px] font-black leading-[1.12] tracking-normal [word-break:keep-all]">
                    {dept?.name}
                  </h3>
                </div>
                
                <div
                  className="result-stagger-3 relative z-10 mt-auto rounded-[22px] border border-white/50 bg-white/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_16px_38px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
                  style={{ transform: "translateZ(42px)" }}
                >
                  <p className="text-[14px] font-semibold leading-[1.68] text-white/92 [word-break:keep-all]">
                    {dept?.desc}
                  </p>
                </div>
                
                <div className="relative z-10 mt-3 text-center text-[12px] font-bold text-white/68">
                  카드를 터치하면 LUNA를 볼 수 있어요
                </div>
              </div>

              
              <div 
                className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[30px] p-6 text-white"
                style={{ 
                  background: "linear-gradient(145deg, rgba(82,75,155,0.85) 0%, rgba(103,90,184,0.85) 58%, rgba(144,127,223,0.9) 100%)",
                  backdropFilter: "blur(22px) saturate(148%)",
                  WebkitBackdropFilter: "blur(22px) saturate(148%)",
                  transform: "rotateY(180deg) translateZ(0)", 
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.48),inset_0_-24px_48px_rgba(39,32,96,0.16)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0.14)_42%,transparent_70%)]" />
                <div className="pointer-events-none absolute -left-10 top-0 h-2/3 w-24 rotate-[18deg] bg-white/30 blur-xl" />
                <img
                  src="/luna-logo.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-6 w-32 opacity-25"
                />

                <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-[66px] w-[66px] items-center justify-center rounded-[24px] border border-white/60 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)] backdrop-blur-xl">
                    <img
                      src="/luna-logo.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-auto drop-shadow-sm"
                    />
                  </div>
                  <h1 className="text-[40px] font-black leading-none tracking-normal">
                    LUNA
                  </h1>
                  <h4 className="mt-3 text-[18px] font-black">함께 만들고 도전해요</h4>
                  <p className="mt-3 max-w-[230px] text-[14px] font-semibold leading-[1.68] text-white/84 [word-break:keep-all]">
                    IT 벤처와 개발, 창업을 함께 경험하는 동아리.
                    루나에서 직접 만들고 도전해보세요.
                  </p>
                </div>

                <div className="relative z-10 text-center text-[12px] font-bold text-white/68">
                  다시 터치하면 결과 카드로 돌아가요
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <div className="mt-auto flex w-full flex-col gap-3">
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-[21px] bg-[#524b9b] px-5 py-4 text-[16px] font-extrabold text-white shadow-[0_14px_32px_rgba(82,75,155,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#463f87] active:translate-y-0 active:scale-[0.98]"
          >
            <RotateCcw size={20} strokeWidth={2.4} />
            처음으로 돌아가기
          </button>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-[21px] border border-[#E5E8EF] bg-white px-5 py-4 text-[15px] font-extrabold text-[#524b9b] shadow-[0_10px_24px_rgba(15,23,42,0.075)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F3F1FF] active:translate-y-0 active:scale-[0.98]"
            onClick={() => window.open('https://luna.codes/', '_blank')}
          >
            LUNA 홈페이지 보기
            <ExternalLink size={18} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </main>
  );
}
