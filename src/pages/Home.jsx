import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { Camera, RefreshCw, ShieldCheck } from "lucide-react";

export default function Home({ onCaptureComplete }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false); // 시작하기 누르면 true로 변경
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");
  const [hasCamera, setHasCamera] = useState(true);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCaptureComplete(imageSrc);
    } else {
      Swal.fire("오류", "카메라를 찾을 수 없습니다.", "error");
    }
  }, [webcamRef, onCaptureComplete]);

  // --- [1] 시작하기 전 화면 ---
  if (!isCameraOpen) {
    return (
      <main className="min-h-dvh bg-[#F9FAFB] text-[#333D4B]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-6 pb-7 pt-7">
          <section className="flex flex-1 flex-col justify-center py-8">
            <p className="mb-4 flex items-center gap-2 text-[14px] font-extrabold text-[#524b9b]">
              <img
                src="/luna-logo.svg"
                alt=""
                className="h-[22px] w-auto"
                aria-hidden="true"
              />
              LUNA
            </p>

            <h1 className="text-[38px] font-black leading-[1.1] tracking-normal text-[#191F28] [word-break:keep-all] sm:text-[42px]">
              내 얼굴과 어울리는
              <br />
              디미고 학과 찾기
            </h1>

            <p className="mt-5 max-w-[320px] text-[15px] font-medium leading-[1.72] text-[#4E5968] [word-break:keep-all]">
              사진을 찍으면 디미고 4개 학과 중 하나를 매칭해드려요.
              결과는 재미로만 즐겨주세요.
            </p>

            <div className="mt-7 flex w-full items-center gap-3 rounded-[20px] border border-[#E5E8EF] bg-white px-4 py-3.5 text-left shadow-[0_14px_36px_rgba(15,23,42,0.055)]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[15px] bg-[#524b9b]/10 text-[#524b9b]">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-semibold leading-[1.55] text-[#6B7684]">
                <span className="block">사진과 정보는 저장되지 않아요.</span>
                <span className="block">결과는 재미로만 봐주세요.</span>
              </p>
            </div>
          </section>

          <div className="w-full">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#524b9b] px-5 py-4 text-[17px] font-extrabold text-white shadow-[0_16px_36px_rgba(82,75,155,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#463f87] active:translate-y-0 active:scale-[0.98]"
            >
              <Camera size={21} strokeWidth={2.4} />
              시작하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- [2] 시작하기 누른 후 (카메라 화면) ---
  return (
      <main className="min-h-dvh bg-[#F9FAFB] text-[#333D4B]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-5 pb-5 pt-6">
        <header className="w-full">
          <p className="text-[13px] font-bold text-[#524b9b]">사진 촬영</p>
          <h2 className="mt-2.5 text-[26px] font-black leading-tight tracking-normal text-[#191F28] [word-break:keep-all]">
            얼굴이 잘 보이게
            <br />
            정면을 바라봐 주세요
          </h2>
          <p className="mt-2 max-w-[310px] text-[13px] font-medium leading-relaxed text-[#6B7684] [word-break:keep-all]">
            화면 안쪽에 얼굴이 들어오면 바로 촬영해도 좋아요.
          </p>
        </header>

        <section className="relative mx-auto my-5 w-full max-w-[350px] overflow-hidden rounded-[30px] border border-white bg-[#E5E8EF] shadow-[0_20px_54px_rgba(15,23,42,0.16)]">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-[29px] bg-[#DDE2EA]">
            {hasCamera ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={facingMode === "user"}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode }}
                onUserMediaError={() => setHasCamera(false)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white px-8 text-sm font-bold leading-relaxed text-[#E5484D] [word-break:keep-all]">
                카메라가 연결되어 있지 않습니다.
              </div>
            )}
          </div>

          {/* 얼굴 가이드라인 */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),transparent_24%,transparent_74%,rgba(0,0,0,0.2))]" />
          <div className="pointer-events-none absolute inset-7 flex items-center justify-center">
            <div className="relative h-[68%] w-[74%] rounded-[44%]">
              <div className="absolute left-0 top-0 h-12 w-12 rounded-tl-[28px] border-l-[3px] border-t-[3px] border-white/90" />
              <div className="absolute right-0 top-0 h-12 w-12 rounded-tr-[28px] border-r-[3px] border-t-[3px] border-white/90" />
              <div className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-[28px] border-b-[3px] border-l-[3px] border-white/90" />
              <div className="absolute bottom-0 right-0 h-12 w-12 rounded-br-[28px] border-b-[3px] border-r-[3px] border-white/90" />
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/28 px-3.5 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur-md">
            얼굴을 가이드 안에 맞춰주세요
          </div>
        </section>

        <div className="mt-auto flex w-full gap-3">
          <button
            onClick={capture}
            className="flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-[21px] bg-[#524b9b] px-5 text-[16px] font-extrabold text-white shadow-[0_14px_32px_rgba(82,75,155,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#463f87] active:translate-y-0 active:scale-[0.98]"
          >
            <Camera size={21} strokeWidth={2.4} />
            촬영하기
          </button>
          <button
            onClick={() =>
              setFacingMode((prev) =>
                prev === "user" ? "environment" : "user",
              )
            }
            aria-label="카메라 전환"
            className="flex min-h-[56px] w-[60px] items-center justify-center rounded-[21px] border border-[#E5E8EF] bg-white text-[#524b9b] shadow-[0_10px_24px_rgba(15,23,42,0.075)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F3F1FF] active:translate-y-0 active:scale-[0.96]"
          >
            <RefreshCw size={22} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </main>
  );
}
