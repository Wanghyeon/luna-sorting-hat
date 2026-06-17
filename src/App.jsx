import { useState } from "react";
import Home from "./pages/Home";
import Analyzing from "./pages/Analyzing";
import Result from "./pages/Result";

export default function App() {
  const [step, setStep] = useState("home"); 
  const [capturedImg, setCapturedImg] = useState(null);
  const [finalDept, setFinalDept] = useState(null);

  const handleCaptureComplete = (imgSrc) => {
    setCapturedImg(imgSrc);
    setStep("analyzing");
  };

  const handleAnalysisComplete = (deptData) => {
    setFinalDept(deptData);
    setStep("result");
  };

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