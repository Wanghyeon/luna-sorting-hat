import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

const CameraView = ({ onCapture }) => {
  const webcamRef = useRef(null);

  // 촬영 버튼을 눌렀을 때 실행되는 함수
  const capture = useCallback(() => {
    // 카메라 화면을 이미지(Base64) 데이터로 캡처
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  // 카메라 설정 (정사각형 비율, 전면 카메라 우선)
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 카메라 뷰파인더 (예쁜 테두리와 둥근 모서리) */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg border-4 border-white w-full max-w-[300px] aspect-square bg-gray-200 flex items-center justify-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="object-cover w-full h-full"
          mirrored={true} // 거울처럼 좌우 반전
        />
        {/* 카메라 화면 위 스캐너 느낌의 십자선 포인트 (선택사항) */}
        <div className="absolute inset-0 border-[1px] border-white/30 pointer-events-none"></div>
      </div>
      
      {/* 둥글고 세련된 촬영 버튼 */}
      <button
        onClick={capture}
        className="mt-10 w-20 h-20 bg-white border-[6px] border-luna-light rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
      >
        <div className="w-14 h-14 bg-luna-main rounded-full flex items-center justify-center">
          <Camera color="white" size={28} />
        </div>
      </button>
    </div>
  );
};

export default CameraView;