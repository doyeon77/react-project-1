import React from "react";
import { FiHeart } from "react-icons/fi";
export default function Header() {
  // 글래스모피즘 효과와 애니메이션 추가
  const glassStyle =
    "backdrop-blur-lg bg-white/70 shadow-xl border-b border-white/30 animate-fade-in";
  return (
    <header
      className={`flex items-center justify-between px-10 py-6 rounded-b-2xl ${glassStyle}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-pink-500 text-4xl drop-shadow-lg animate-bounce">
          <FiHeart />
        </span>
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
          챙겨먹기
        </span>
      </div>
      <span className="text-base text-indigo-400 font-semibold italic animate-fade-in">
        건강한 하루를 위한 습관
      </span>
    </header>
  );
}
