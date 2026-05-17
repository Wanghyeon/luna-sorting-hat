import { useState, useRef } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";

export default function Result({ dept, onRestart }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 24, opacity: 0 });
  const cardRef = useRef(null);

  // 마우스 및 터치 이동 시 3D 기울임 각도 계산
  const handleMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current.getBoundingClientRect();
    
    // 모바일 터치와 PC 마우스 이벤트 둘 다 처리
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - card.left;
    const y = clientY - card.top;

    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const ratioX = (x - centerX) / centerX;
    const ratioY = (y - centerY) / centerY;

    // 최대 11도까지만 부드럽게 기울어지도록 설정
    const rotateX = Math.max(Math.min(ratioY * -11, 11), -11);
    const rotateY = Math.max(Math.min(ratioX * 11, 11), -11);

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: Math.max(Math.min((x / card.width) * 100, 100), 0),
      y: Math.max(Math.min((y / card.height) * 100, 100), 0),
      opacity: 0.26,
    });
  };

  // 손을 떼면 카드가 원래 평면으로 스르륵 돌아옴
  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 24, opacity: 0 });
  };

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
          style={{ perspective: "1200px" }}
        >
          {/* 기울임(Tilt) 애니메이션 래퍼 */}
          <div
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onTouchMove={handleMove}
            onTouchEnd={handleLeave}
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-full w-full cursor-pointer touch-pan-y transition-transform will-change-transform"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
                tilt.x || tilt.y ? 1.018 : 1
              })`,
              transitionDuration: tilt.x === 0 && tilt.y === 0 ? "650ms" : "80ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 뒤집기(Flip) 애니메이션 래퍼 */}
            <div 
              className="relative h-full w-full rounded-[30px] shadow-[0_24px_64px_rgba(15,23,42,0.2)] transition-transform duration-[850ms] will-change-transform"
              style={{ 
                transformStyle: "preserve-3d", 
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* --- [앞면] 학과 결과 --- */}
              <div 
                className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[30px] p-6 text-left text-white"
                style={{ 
                  background: `linear-gradient(145deg, ${dept?.color || "#2b274b"} 0%, ${dept?.color || "#2b274b"} 56%, #111827 100%)`, 
                  backfaceVisibility: "hidden" 
                }}
              >
                {/* 빛 반사 효과 */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.04)_36%,transparent_64%)]" />
                <div
                  className="pointer-events-none absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-2xl transition-opacity duration-200"
                  style={{
                    left: `${glare.x}%`,
                    top: `${glare.y}%`,
                    opacity: glare.opacity,
                  }}
                />
                
                <div className="relative z-10">
                  <span className="inline-flex rounded-full border border-white/18 bg-white/12 px-3 py-1.5 text-[11px] font-black text-white/82 backdrop-blur-md">
                    추천 학과
                  </span>
                  <h3 className="mt-4 text-[31px] font-black leading-[1.12] tracking-normal [word-break:keep-all]">
                    {dept?.name}
                  </h3>
                </div>
                
                <div
                  className="relative z-10 mt-auto rounded-[22px] border border-white/16 bg-white/13 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl"
                  style={{ transform: "translateZ(34px)" }}
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
                  background: "linear-gradient(145deg, #524b9b 0%, #675ab8 60%, #907fdf 100%)", 
                  transform: "rotateY(180deg)", 
                  backfaceVisibility: "hidden" 
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.04)_45%,transparent_70%)]" />
                <img
                  src="/luna-logo.svg"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-6 w-40 opacity-15"
                />
                <div
                  className="pointer-events-none absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-2xl transition-opacity duration-200"
                  style={{
                    left: `${glare.x}%`,
                    top: `${glare.y}%`,
                    opacity: glare.opacity,
                  }}
                />

                <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-[66px] w-[66px] items-center justify-center rounded-[24px] border border-white/22 bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md">
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
