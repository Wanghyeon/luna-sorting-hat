import { useState, useRef } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";

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

  return (
    <main className="min-h-dvh bg-[#F9FAFB] text-[#333D4B]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-5 pb-5 pt-6 select-none">
        {/* 헤더 영역 */}
        <header className="w-full">
          <p className="text-[13px] font-bold text-[#524b9b]">결과가 나왔어요</p>
          <h2 className="mt-2.5 text-[28px] font-black leading-tight tracking-normal text-[#191F28]">
            당신에게 딱 맞는
            <br />
            디미고 학과는?
          </h2>
        </header>

        {/* 3D 인터랙티브 카드 영역 */}
        <section
          className="relative mx-auto my-6 w-full max-w-[300px] aspect-[3/4.18]"
          style={{ perspective: "1500px" }}
        >
          {!hasInteracted && (
            <div className="pointer-events-none absolute -left-8 -right-8 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-1 text-[#524b9b]/55">
              <span className="swipe-hint-left text-[30px] font-black leading-none">‹</span>
              <span className="swipe-hint-right text-[30px] font-black leading-none">›</span>
            </div>
          )}

          {/* 기울임(Tilt) 애니메이션 래퍼 */}
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
            {/* 뒤집기(Flip) 애니메이션 래퍼 */}
            <div 
              className="relative h-full w-full rounded-[30px] shadow-[0_26px_70px_rgba(15,23,42,0.24)] transition-transform duration-[850ms] will-change-transform"
              style={{ 
                transformStyle: "preserve-3d", 
                WebkitTransformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* --- [앞면] 학과 결과 --- */}
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
                <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/36 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-24px_48px_rgba(0,0,0,0.16)]" />
                <img
                  src="/dimigo-logo-white.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-8 w-36 opacity-[0.11]"
                />
                {/* 빛 반사 효과 */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.07)_32%,transparent_64%)]" />
                <div className="pointer-events-none absolute left-5 right-5 top-4 h-px bg-white/60" />
                <div className="pointer-events-none absolute -left-12 top-0 h-2/3 w-24 rotate-[18deg] bg-white/18 blur-xl" />
                
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/12 px-3 py-1.5 text-[11px] font-black text-white/82 backdrop-blur-md">
                    <img
                      src="/dimigo-logo-white.png"
                      alt=""
                      aria-hidden="true"
                      className="h-3.5 w-auto opacity-80"
                    />
                    추천 학과
                  </span>
                  <h3 className="mt-4 text-[31px] font-black leading-[1.12] tracking-normal [word-break:keep-all]">
                    {dept?.name}
                  </h3>
                </div>
                
                <div
                  className="relative z-10 mt-auto rounded-[22px] border border-white/28 bg-white/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_16px_38px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
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

              {/* --- [뒷면] 루나 홍보 --- */}
              <div 
                className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[30px] p-6 text-white"
                style={{ 
                  background: "linear-gradient(145deg, rgba(82,75,155,0.68) 0%, rgba(103,90,184,0.68) 58%, rgba(144,127,223,0.72) 100%)",
                  backdropFilter: "blur(22px) saturate(148%)",
                  WebkitBackdropFilter: "blur(22px) saturate(148%)",
                  transform: "rotateY(180deg) translateZ(0)", 
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.48),inset_0_-24px_48px_rgba(39,32,96,0.16)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.27)_0%,rgba(255,255,255,0.07)_42%,transparent_70%)]" />
                <div className="pointer-events-none absolute left-5 right-5 top-4 h-px bg-white/60" />
                <div className="pointer-events-none absolute -left-10 top-0 h-2/3 w-24 rotate-[18deg] bg-white/18 blur-xl" />
                <img
                  src="/luna-logo.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-6 w-40 opacity-15"
                />

                <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-[66px] w-[66px] items-center justify-center rounded-[24px] border border-white/30 bg-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)] backdrop-blur-xl">
                    <img
                      src="/luna-logo.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-10 w-auto drop-shadow-sm"
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

        {/* 하단 버튼 영역 */}
        <div className="mt-auto flex w-full flex-col gap-3">
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-[21px] bg-[#524b9b] px-5 py-4 text-[16px] font-extrabold text-white shadow-[0_14px_32px_rgba(82,75,155,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#463f87] active:translate-y-0 active:scale-[0.98]"
          >
            <RotateCcw size={20} strokeWidth={2.4} />
            다시 검사하기
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
