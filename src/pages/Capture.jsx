import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CameraView from '../components/CameraView';

const Capture = ({ onNext, onBack }) => {
  const handleCapture = (imageSrc) => {
    // 찰칵! 찍힌 사진 데이터를 App.jsx로 넘기고 다음(분석) 화면으로 이동
    onNext(imageSrc);
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-luna-bg p-6"
      // 화면 전환 시 부드럽게 오른쪽에서 나타나는 애니메이션
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 상단 뒤로가기 바 */}
      <div className="flex items-center mt-2 mb-8">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 text-luna-dark hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={26} />
        </button>
        <h2 className="ml-2 text-lg font-bold text-luna-dark">AI 얼굴 스캔</h2>
      </div>

      {/* 헤드라인 텍스트 */}
      <div className="text-center mb-10 space-y-3">
        <h3 className="text-3xl font-extrabold text-luna-main leading-snug">
          당신의 가능성을<br/>스캔합니다
        </h3>
        <p className="text-sm font-medium text-gray-500">
          정면을 바라보고 촬영 버튼을 눌러주세요.
        </p>
      </div>

      {/* 카메라 뷰 영역 (가운데 정렬) */}
      <div className="flex-1 flex flex-col items-center justify-start mt-4">
        <CameraView onCapture={handleCapture} />
      </div>
    </motion.div>
  );
};

export default Capture;
