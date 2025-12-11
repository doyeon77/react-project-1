import React from "react";

export default function TodayStats({ meds = [] }) {
  if (!Array.isArray(meds) || meds.length === 0) return null; // 데이터가 없으면 렌더링하지 않음

  const total = meds.length;
  const taken = meds.filter((m) => m.taken).length;
  const notTaken = total - taken;

  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-sm shadow">
        복용 완료: {taken}개
      </div>
      <div className="px-4 py-2 rounded-xl bg-pink-100 text-pink-700 font-bold text-sm shadow">
        미복용: {notTaken}개
      </div>
      <div className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm shadow">
        전체: {total}개
      </div>
    </div>
  );
}
