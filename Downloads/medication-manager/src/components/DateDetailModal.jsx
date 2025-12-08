import React from "react";

export default function DateDetailModal({ open, onClose, date, record }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[320px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-4">{date} 복용 기록</h2>
        {record && record.allMeds && record.allMeds.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {record.allMeds.map((med, idx) => (
              <li key={idx} className="flex items-center gap-2 text-lg">
                <span className="font-semibold">{med.name}</span>
                {med.time && (
                  <span className="text-xs text-gray-500">{med.time}</span>
                )}
                <span>{med.taken ? "✅" : "❌"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">복용할 약 없음</div>
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-500 text-white py-2 rounded-lg font-bold hover:bg-indigo-600 transition-all"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
