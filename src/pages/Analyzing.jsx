import { useEffect, useState } from "react";

const DEPARTMENTS = [
  { id: "eb", name: "e-비즈니스과", color: "#730d1a", desc: "IT 기술과 비즈니스를 융합하여 미래의 창업가와 비즈니스 리더를 육성합니다." },
  { id: "dc", name: "디지털콘텐츠과", color: "#065840", desc: "UI/UX 디자인, 영상 제작, 3D 그래픽 등 크리에이티브한 디지털 아티스트를 양성합니다." },
  { id: "wp", name: "웹프로그래밍과", color: "#000000", desc: "풀스택 웹 개발, 소프트웨어 엔지니어링 등 IT 산업의 핵심 개발자를 육성합니다." },
  { id: "hs", name: "해킹방어과", color: "#1a1c4e", desc: "사이버 보안, 정보 보호, 모의 해킹 등 안전한 디지털 세상을 만드는 화이트 해커를 양성합니다." }
];

const hexToRgba = (hex, alpha) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Analyzing({ capturedImg, onComplete }) {
  const [currentDeptText, setCurrentDeptText] = useState("");
  const [progress, setProgress] = useState(0);
  
  // 분석 완료 상태와 최종 결정된 학과를 저장하는 state 추가
  const [isDone, setIsDone] = useState(false);
  const [resultDept, setResultDept] = useState(null);

  useEffect(() => {
    // 최종 결과 미리 하나 뽑아두기
    const finalDept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    
    // 학과 이름 또로로롱 고속 변경
    const textInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * DEPARTMENTS.length);
      setCurrentDeptText(DEPARTMENTS[randomIndex].name);
    }, 70);

    // 2.5초 동안 게이지 상승
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          
          // 완료되면 텍스트를 최종 결과로 고정하고, 완료 상태로 변경! (아직 안 넘어감)
          setCurrentDeptText(finalDept.name);
          setResultDept(finalDept);
          setIsDone(true);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const themeColor = resultDept?.color || "#524b9b";
  const themedBackground = isDone
    ? `linear-gradient(180deg, ${hexToRgba(themeColor, 0.16)} 0%, #F9FAFB 46%, ${hexToRgba(themeColor, 0.1)} 100%)`
    : "#F9FAFB";

  return (
    <main
      className="min-h-dvh text-[#333D4B] transition-[background] duration-700"
      style={{ background: themedBackground }}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-5 pb-6 pt-6">
        <header className="mb-5">
          <p className="text-[13px] font-bold text-[#524b9b]">
            {isDone ? "결과 준비 완료" : "학과 매칭 중"}
          </p>
          <h2 className="mt-2.5 text-[26px] font-black leading-tight tracking-normal text-[#191F28] [word-break:keep-all]">
            {!isDone ? "어떤 학과가 어울릴지 고르는 중이에요" : "결과가 나왔어요"}
          </h2>
          <p className="mt-2 max-w-[320px] text-[13px] font-medium leading-relaxed text-[#6B7684] [word-break:keep-all]">
            {!isDone ? "잠깐만 기다리면 결과를 확인할 수 있어요." : "아래 버튼을 눌러 추천 학과를 확인해보세요."}
          </p>
        </header>

        {/* 사진 및 상단 고정 텍스트 */}
        <section className="relative mx-auto w-full max-w-[350px] overflow-hidden rounded-[30px] border border-white bg-[#111827] shadow-[0_20px_54px_rgba(15,23,42,0.18)]">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-[29px]">
            {capturedImg && (
              <img
                src={capturedImg}
                alt="Captured"
                className={`h-full w-full object-cover transition-all duration-700 ${
                  isDone ? "scale-100 opacity-100 grayscale-0 contrast-105" : "opacity-70"
                }`}
              />
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),transparent_32%,rgba(0,0,0,0.34))]" />
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              isDone ? "opacity-16" : "opacity-0"
            }`}
            style={{
              background: `linear-gradient(145deg, ${
                resultDept?.color || "#524b9b"
              } 0%, transparent 66%, rgba(0,0,0,0.08) 100%)`,
              mixBlendMode: "overlay",
            }}
          />
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              isDone ? "opacity-2" : "opacity-0"
            }`}
            style={{
              background: `radial-gradient(circle at 50% 30%, ${
                resultDept?.color || "#907fdf"
              } 0%, transparent 62%)`,
              mixBlendMode: "color",
            }}
          />
          <div
            className={`pointer-events-none absolute left-6 right-6 h-[3px] rounded-full bg-white/80 shadow-[0_0_22px_rgba(255,255,255,0.7)] transition-all duration-100 ${
              isDone ? "opacity-0" : "opacity-100"
            }`}
            style={{ top: `${Math.min(progress, 96)}%` }}
          />

          <div className="absolute left-4 right-4 top-4">
            <div
              className="mx-auto max-w-[292px] rounded-[20px] border border-white/60 bg-white/92 px-4 py-3.5 text-center shadow-[0_14px_34px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-colors duration-700"
              style={{
                boxShadow: isDone
                  ? `0 16px 38px ${resultDept?.color || "#524b9b"}33`
                  : "0 14px 34px rgba(15,23,42,0.15)",
              }}
            >
              <p
                className="mb-1 text-[12px] font-bold transition-colors duration-700"
                style={{ color: isDone ? resultDept?.color : "#524b9bbf" }}
              >
                {isDone ? "추천 학과" : "후보를 확인하고 있어요"}
              </p>
              <span className="block min-h-[30px] text-[22px] font-black leading-tight tracking-normal text-[#191F28] [word-break:keep-all]">
                {currentDeptText}
              </span>
            </div>
          </div>
        </section>

        {/* 분석 중일 땐 진행바를, 완료됐을 땐 버튼을 렌더링 */}
        <div className="mx-auto mt-6 w-full max-w-[350px]">
          {!isDone ? (
            <>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#E5E8EF]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#524b9b] to-[#907fdf] shadow-[0_0_18px_rgba(144,127,223,0.5)] transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[13px] font-bold text-[#6B7684]">
                <span>매칭 진행률</span>
                <span className="text-[#524b9b]">{progress}%</span>
              </div>
            </>
          ) : (
            <button
              onClick={() => onComplete(resultDept)}
              className="flex w-full items-center justify-center gap-2 rounded-[21px] bg-[#524b9b] px-5 py-4 text-[16px] font-extrabold text-white shadow-[0_14px_32px_rgba(82,75,155,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#463f87] active:translate-y-0 active:scale-[0.98]"
            >
              결과 확인하기
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
