import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import DateDetailModal from "../components/DateDetailModal";

export default function Dashboard() {
  // 임시 저장 함수 (실제 구현 필요시 교체)
  const handleSaveDateRecord = () => {};
  // 해당 날짜와 요일에 복용해야 하는 약만 필터링하는 함수
  function filterMedsForDay(meds, dateStr, dayOfWeek) {
    return meds.filter(
      (med) =>
        (med.days && med.days.includes(dayOfWeek)) ||
        (med.dates && med.dates.includes(dateStr))
    );
  }
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const { medications } = useContext(UserContext);
  const normalizedMeds = medications;
  const [editDate, setEditDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  // ...기존 변수 및 함수 정의 생략...

  function renderCalendar() {
    // 달력 정보 변수 선언
    const daysInMonth = new Date(
      calendarMonth.year,
      calendarMonth.month + 1,
      0
    ).getDate();
    const firstDayOfWeek = new Date(
      calendarMonth.year,
      calendarMonth.month,
      1
    ).getDay();
    // 달력 셀 배열 생성 (빈칸 + 날짜)
    const calendarCells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarCells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      calendarCells.push(d);
    }
    const cellStyle = {
      width: "95px",
      height: "105px",
      minWidth: "95px",
      minHeight: "105px",
      maxWidth: "95px",
      maxHeight: "105px",
      padding: "10px 6px",
      borderRadius: "1rem",
      boxShadow: "0 2px 8px 0 rgba(180,180,255,0.10)",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "start",
    };
    return (
      <div>
        {/* 상단 년/월 및 이전/다음달 버튼 */}
        <div className="flex items-center justify-center mb-4 gap-4">
          <button
            className="px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-300 text-indigo-700 font-bold text-lg"
            onClick={() => {
              setCalendarMonth((prev) => {
                let year = prev.year;
                let month = prev.month - 1;
                return {
                  ...prev,
                  month: month < 0 ? 11 : month,
                  year: month < 0 ? year - 1 : year,
                };
              });
            }}
          >
            ◀
          </button>
          <select
            className="px-2 py-1 rounded border border-indigo-200 text-indigo-800 font-bold text-lg mr-2"
            value={calendarMonth.year}
            onChange={(e) =>
              setCalendarMonth((prev) => ({
                ...prev,
                year: Number(e.target.value),
              }))
            }
          >
            {Array.from(
              { length: new Date().getFullYear() - 2020 + 1 },
              (_, i) => 2020 + i
            ).map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            className="px-2 py-1 rounded border border-indigo-200 text-indigo-800 font-bold text-lg"
            value={calendarMonth.month + 1}
            onChange={(e) =>
              setCalendarMonth((prev) => ({
                ...prev,
                month: Number(e.target.value) - 1,
              }))
            }
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <button
            className="px-3 py-1 rounded bg-indigo-100 hover:bg-indigo-300 text-indigo-700 font-bold text-lg"
            onClick={() => {
              setCalendarMonth((prev) => {
                let year = prev.year;
                let month = prev.month + 1;
                return {
                  ...prev,
                  month: month > 11 ? 0 : month,
                  year: month > 11 ? year + 1 : year,
                };
              });
            }}
          >
            ▶
          </button>
        </div>
        {/* 달력 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-bold text-indigo-600">
              {day}
            </div>
          ))}
        </div>
        {/* 달력 날짜 셀 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return (
                <div key={idx} style={cellStyle} className="border bg-white" />
              );
            }
            // 날짜 문자열 생성
            const dateStr = `${calendarMonth.year}-${String(
              calendarMonth.month + 1
            ).padStart(2, "0")}-${String(cell).padStart(2, "0")}`;
            const dayOfWeek = weekDays[(firstDayOfWeek + cell - 1) % 7];
            const medsForDay = filterMedsForDay(
              normalizedMeds,
              dateStr,
              dayOfWeek
            );
            return (
              <div
                key={idx}
                style={cellStyle}
                className="border bg-white flex flex-col items-center justify-start"
              >
                <span className="font-bold text-indigo-700 text-lg mb-1">
                  {cell}
                </span>
                <div className="flex flex-col gap-1 w-full items-center">
                  {medsForDay.length > 0 ? (
                    medsForDay.map((med, mIdx) => {
                      // 복용여부: times별로 모두 체크
                      return (
                        <div
                          key={mIdx}
                          className="truncate text-xs text-gray-700 flex items-center gap-1"
                        >
                          <span>{med.name}</span>
                          {med.times.map((t, tIdx) => {
                            const doseKey = `${dateStr}T${t.time || "08:00"}`;
                            const taken =
                              med.takenRecords &&
                              med.takenRecords[doseKey] === true;
                            return (
                              <span key={tIdx} className="ml-1">
                                {taken ? "✅" : "❌"}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-400">약 없음</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4">
      {/* 달력 렌더링 */}
      {renderCalendar()}
    </div>
  );
}
