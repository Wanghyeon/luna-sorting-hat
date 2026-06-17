import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import CameraView from '../components/CameraView';

const Capture = ({ onNext, onBack }) => {
  const handleCapture = (imageSrc) => {
    onNext(imageSrc);
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-luna-bg p-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center mt-2 mb-8">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 text-luna-dark hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={26} />
        </button>
        <h2 className="ml-2 text-lg font-bold text-luna-dark">AI 얼굴 스캔</h2>
      </div>

      <div className="text-center mb-10 space-y-3">
        <h3 className="text-3xl font-extrabold text-luna-main leading-snug">
          당신의 가능성을<br/>스캔합니다
        </h3>
        <p className="text-sm font-medium text-gray-500">
          정면을 바라보고 촬영 버튼을 눌러주세요.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start mt-4">
        <CameraView onCapture={handleCapture} />
      </div>
    </motion.div>
  );
};

export default Capture;
