import React, { useState } from "react";

export default function TodayMemo({ date }) {
  const key = `memo-${date}`;
  const [memo, setMemo] = useState(() => localStorage.getItem(key) || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(key, memo);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="my-6">
      <label className="block font-bold mb-2 text-gray-700">오늘의 메모</label>
      <textarea
        className="w-full min-h-[60px] rounded-xl border border-gray-200 p-3 text-gray-700 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="오늘의 컨디션, 복용 관련 메모를 남겨보세요!"
      />
      <button
        className="mt-2 px-4 py-2 rounded-xl bg-blue-200 text-blue-800 font-bold border border-blue-300 hover:bg-blue-300 transition-all"
        onClick={handleSave}
      >
        메모 저장
      </button>
      {saved && (
        <span className="ml-3 text-green-600 font-semibold">저장됨!</span>
      )}
    </div>
  );
}
