import React, { useEffect } from "react";

export default function Confetti({ show, onEnd }) {
  useEffect(() => {
    if (!show) return;
    // 간단한 confetti 애니메이션 (canvas 없이 이모지 활용)
    const timer = setTimeout(() => {
      if (onEnd) onEnd();
    }, 2500);
    return () => clearTimeout(timer);
  }, [show, onEnd]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 이모지 폭죽 애니메이션 */}
        <div
          className="animate-bounce text-7xl select-none"
          style={{ filter: "drop-shadow(0 0 16px #fff)" }}
        >
          🎉✨🎊
        </div>
        <div className="absolute left-1/4 top-1/4 animate-float text-5xl select-none">
          🎆
        </div>
        <div className="absolute right-1/4 top-1/3 animate-float2 text-5xl select-none">
          🎇
        </div>
        <div className="absolute left-1/3 bottom-1/4 animate-float3 text-5xl select-none">
          🌟
        </div>
        <div className="absolute right-1/3 bottom-1/3 animate-float4 text-5xl select-none">
          💫
        </div>
      </div>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
        .animate-float { animation: float 1.8s ease-in-out; }
        .animate-float2 { animation: float 2s 0.2s ease-in-out; }
        .animate-float3 { animation: float 1.7s 0.1s ease-in-out; }
        .animate-float4 { animation: float 2.1s 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
