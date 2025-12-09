import React from "react";

const tips = [
  "물을 충분히 마시세요!",
  "규칙적인 식사와 수면이 건강의 기본입니다.",
  "오늘도 건강 챙기기, 잘하고 있어요!",
  "약 복용 후 부작용이 있으면 꼭 기록해두세요.",
  "작은 습관이 큰 변화를 만듭니다!",
  "운동도 잊지 마세요!",
  "긍정적인 마음가짐이 건강에 좋아요.",
  "오늘도 파이팅! 💪",
];

export default function HealthTip() {
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return (
    <div className="my-4 p-4 rounded-xl bg-blue-50 text-blue-700 font-semibold text-center shadow animate-fade-in">
      {tip}
    </div>
  );
}
