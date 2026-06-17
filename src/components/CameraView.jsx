import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

const CameraView = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  return (
    <div className="flex flex-col items-center w-full">

      <div className="relative overflow-hidden rounded-3xl shadow-lg border-4 border-white w-full max-w-[300px] aspect-square bg-gray-200 flex items-center justify-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="object-cover w-full h-full"
          mirrored={true}
        />
        <div className="absolute inset-0 border-[1px] border-white/30 pointer-events-none"></div>
      </div>

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
