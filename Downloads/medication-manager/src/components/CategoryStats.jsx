import React from "react";

export default function CategoryStats({ meds = [] }) {
  if (!Array.isArray(meds) || meds.length === 0) return null; // 데이터가 없으면 렌더링하지 않음

  // 카테고리별 복용 현황
  const categories = {};
  meds.forEach((med) => {
    if (Array.isArray(med.times)) {
      med.times.forEach((t) => {
        if (!categories[t.category])
          categories[t.category] = { total: 0, taken: 0 };
        categories[t.category].total += 1;
        if (med.takenTimes && med.takenTimes[t.category]) {
          categories[t.category].taken += 1;
        }
      });
    } else if (med.type) {
      if (!categories[med.type]) categories[med.type] = { total: 0, taken: 0 };
      categories[med.type].total += 1;
      if (med.taken) categories[med.type].taken += 1;
    }
  });

  const keys = Object.keys(categories);
  if (keys.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="font-bold text-gray-700 mb-2">카테고리별 복용 현황</div>
      <div className="flex flex-wrap gap-3">
        {keys.map((cat) => {
          const { total, taken } = categories[cat];
          const percent = total > 0 ? Math.round((taken / total) * 100) : 0;
          return (
            <div
              key={cat}
              className="flex flex-col items-center px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold shadow border border-indigo-100 min-w-[90px]"
            >
              <span className="text-sm mb-1">{cat}</span>
              <span className="text-lg">{percent}%</span>
              <span className="text-xs text-gray-400">
                {taken}/{total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
