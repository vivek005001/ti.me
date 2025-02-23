'use client';
import { useEffect, useRef } from 'react';
import Lottie from 'react-lottie-player';

const audioWaveAnimation = {
  v: "5.5.7",
  fr: 60,
  ip: 0,
  op: 180,
  w: 400,
  h: 400,
  nm: "Simple Audio Wave",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Wave",
    ks: {
      o: { a: 0, k: 100 },
      p: { a: 0, k: [200, 200, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { 
        a: 1, 
        k: [
          { t: 0, s: [100, 100], e: [120, 120] },
          { t: 90, s: [120, 120], e: [100, 100] },
          { t: 180, s: [100, 100] }
        ]
      }
    },
    shapes: [{
      ty: "rc",
      d: 1,
      s: { a: 0, k: [100, 100] },
      p: { a: 0, k: [0, 0] },
      r: { a: 0, k: 0 }
    }]
  }]
};

interface AudioRecordingModalProps {
  onStop: () => void;
  onCancel: () => void;
}

export default function AudioRecordingModal({ onStop, onCancel }: AudioRecordingModalProps) {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
        <div className="text-center">
          <div className="w-[200px] h-[200px]">
            <Lottie
              ref={lottieRef}
              loop
              play
              animationData={audioWaveAnimation}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <p className="text-white text-xl mb-4">Recording Audio...</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onStop}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400"
            >
              Stop
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 