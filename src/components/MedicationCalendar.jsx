import React from "react";

// 날짜별 복용 기록(복용 여부 + 약 이름 목록)을 받아 달력에 표시
export default function MedicationCalendar({
  records,
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onDateClick,
}) {
  // records: { 'YYYY-MM-DD': { taken: boolean, meds: string[] } } 형태
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  // 달력 배열 생성
  const calendar = [];
  for (let i = 0; i < startDay; i++) {
    calendar.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendar.push(d);
  }

  // 날짜 포맷 함수
  const formatDate = (d) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-16 animate-fade-in w-full max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-600 font-bold hover:bg-indigo-200 transition-all"
        >
          ◀
        </button>
        <h3 className="text-xl font-bold text-indigo-700">
          {year}년 {monthNames[month]} 복용 기록
        </h3>
        <button
          onClick={onNextMonth}
          className="px-2 py-1 rounded-lg bg-indigo-100 text-indigo-600 font-bold hover:bg-indigo-200 transition-all"
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-16 text-lg">
        {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
          <div key={w} className="text-center font-semibold text-gray-400 mb-2">
            {w}
          </div>
        ))}
        {calendar.map((d, i) => {
          const key = formatDate(d);
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(
            today.getMonth() + 1
          ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          // records[key]가 없으면 빈 allMeds로 대체
          const record = records[key] || {};
          const allMeds = Array.isArray(record.allMeds) ? record.allMeds : [];
          const isFuture = key > todayStr;
          return d ? (
            <div
              key={d}
              className={`h-24 w-24 flex flex-col items-center justify-center rounded-2xl shadow-lg transition-all
                ${
                  isFuture
                    ? "bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-500 font-bold"
                    : record.taken
                    ? "bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-bold"
                    : allMeds.length > 0 && !record.taken
                    ? "bg-gradient-to-br from-pink-200 to-pink-300 text-white font-bold"
                    : "bg-gray-200 text-gray-500"
                }
                hover:scale-105 animate-fade-in`}
              onClick={() => onDateClick && onDateClick(key)}
              style={{ cursor: onDateClick ? "pointer" : "default" }}
            >
              <span className="text-xl">{d}</span>
              <div className="mt-2 text-sm text-center flex flex-col gap-1 w-full">
                {allMeds.length > 0 ? (
                  [...allMeds]
                    .sort((a, b) => {
                      // 00:00(취침전)은 항상 맨 뒤, 나머지는 시간 오름차순
                      const tA = a.time || "00:00";
                      const tB = b.time || "00:00";
                      if (tA === "00:00" && tB !== "00:00") return 1;
                      if (tB === "00:00" && tA !== "00:00") return -1;
                      // 00:00이 아닌 경우 시간 오름차순
                      return tA.localeCompare(tB);
                    })
                    .map((med, idx) => (
                      <div
                        key={idx}
                        className="truncate flex items-center justify-center gap-1"
                      >
                        <span className="font-semibold">{med.name}</span>
                        <span className="text-xs text-gray-500">
                          {med.time || ""}
                        </span>
                        {isFuture ? (
                          <span className="text-blue-400 font-bold">
                            ⏳ 복용예정
                          </span>
                        ) : (
                          <span>{med.taken ? "✅" : "❌"}</span>
                        )}
                      </div>
                    ))
                ) : (
                  <span className="text-gray-400 text-xs">복용할 약 없음</span>
                )}
              </div>
            </div>
          ) : (
            <div key={"empty-" + i}></div>
          );
        })}
      </div>
    </div>
  );
}
