import { useState } from "react";
import Home from "./pages/Home";
import Analyzing from "./pages/Analyzing";
import Result from "./pages/Result";

export default function App() {
  // 현재 화면 단계 관리: "home" -> "analyzing" -> "result"
  const [step, setStep] = useState("home"); 
  const [capturedImg, setCapturedImg] = useState(null);
  const [finalDept, setFinalDept] = useState(null);

  // 1. 홈 화면에서 촬영 완료 시 -> 분석 화면으로 이동
  const handleCaptureComplete = (imgSrc) => {
    setCapturedImg(imgSrc);
    setStep("analyzing");
  };

  // 2. 분석 화면에서 2.5초 뒤 완료 시 -> 결과 화면으로 자동 이동
  const handleAnalysisComplete = (deptData) => {
    setFinalDept(deptData);
    setStep("result");
  };

  // 3. 결과 화면에서 다시 시작 버튼 클릭 시 -> 홈으로 리셋
  const handleRestart = () => {
    setCapturedImg(null);
    setFinalDept(null);
    setStep("home");
  };

  return (
    <div className="min-h-screen bg-[#fafaff] text-[#2b274b] font-sans antialiased">
      {step === "home" && (
        <Home onCaptureComplete={handleCaptureComplete} />
      )}
      
      {step === "analyzing" && (
        <Analyzing capturedImg={capturedImg} onComplete={handleAnalysisComplete} />
      )}
      
      {step === "result" && (
        <Result dept={finalDept} onRestart={handleRestart} />
      )}
    </div>
  );
}