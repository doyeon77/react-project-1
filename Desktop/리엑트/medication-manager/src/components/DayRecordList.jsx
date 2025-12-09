import React from "react";

export default function DayRecordList({ records }) {
  if (!records || Object.keys(records).length === 0) {
    return <div className="text-gray-400 text-center">기록이 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-8">
      {Object.entries(records).map(([date, record]) => (
        <div
          key={date}
          className="bg-white rounded-xl shadow p-4 border border-gray-100"
        >
          <div className="font-bold text-indigo-700 mb-2">{date}</div>
          {record.allMeds && record.allMeds.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {record.allMeds.map((med, idx) => (
                <li key={idx} className="flex items-center gap-2 text-base">
                  <span className="font-semibold">{med.name}</span>
                  <span className="text-xs text-gray-500">{med.time}</span>
                  <span>{med.taken ? "✅" : "❌"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-xs">복용할 약 없음</div>
          )}
        </div>
      ))}
    </div>
  );
}
