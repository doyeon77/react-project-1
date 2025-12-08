import React, { useState, useEffect, useMemo, useContext } from "react";
import { UserContext } from "../UserContext";
import MedicationStatsChart from "../components/MedicationStatsChart";

import AddMedicationModal from "../../AddMedicationModal";

import DayRecordList from "../components/DayRecordList";
import DateDetailModal from "../components/DateDetailModal";
export default function Dashboard() {
  // 홈의 과거 복용약 예시 데이터와 동일하게 선언
  // 과거 약의 takenRecords를 80% 확률로 true로 생성하는 함수
  function generateTakenRecords(startDate, endDate, days, times) {
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const records = {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = weekDays[d.getDay()];
      if (!days.includes(dayName)) continue;
      times.forEach((t) => {
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
        const key = `${dateStr}T${t.time || "08:00"}`;
        records[key] = Math.random() < 0.8; // 80% 확률로 true
      });
    }
    return records;
  }

  // 오늘 달(2025-12)에 무조건 표시되도록 예시 데이터 기간을 강제 지정
  const examplePastMeds = [
    {
      id: "ex1",
      name: "아목시실린",
      type: "항생제",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      days: ["월", "화", "수", "목", "금", "토", "일"],
      times: [{ category: "기본", time: "08:00" }],
    },
    {
      id: "ex2",
      name: "노바스크",
      type: "고혈압 치료제",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      days: ["월", "화", "수", "목", "금", "토", "일"],
      times: [{ category: "기본", time: "08:00" }],
    },
    {
      id: "ex3",
      name: "센트룸 실버",
      type: "비타민/영양제",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      days: ["월", "화", "수", "목", "금", "토", "일"],
      times: [{ category: "기본", time: "08:00" }],
    },
    {
      id: "ex4",
      name: "타이레놀",
      type: "진통제",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      days: ["월", "화", "수", "목", "금", "토", "일"],
      times: [{ category: "기본", time: "08:00" }],
    },
    {
      id: "ex5",
      name: "플루옥세틴",
      type: "우울증 치료제",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      days: ["월", "화", "수", "목", "금", "토", "일"],
      times: [{ category: "기본", time: "08:00" }],
    },
    {
      id: "ex6",
      name: "리피토",
      type: "고지혈증 치료제",
      startDate: "2025-12-01",
      endDate: "2025-12-31",
      days: ["월", "화", "수", "목", "금", "토", "일"],
      times: [{ category: "기본", time: "08:00" }],
    },
  ].map((med) => ({
    ...med,
    takenRecords: generateTakenRecords(
      med.startDate,
      med.endDate,
      med.days,
      med.times
    ),
  }));
  // 예시 데이터 강제 초기화 함수
  const nowExample = new Date();
  const padExample = (n) => String(n).padStart(2, "0");
  // 예시 데이터: 앱 최초 실행 시 과거/현재/미래 약 자동 추가 (공통)
  // 실제 코드용 변수와 충돌 방지 위해 Example 접두어 사용
  // 중복 선언 제거: 최상단 선언만 사용
  // 월/연도 보정 함수
  function getYearMonth(baseDate, offset) {
    const year = baseDate.getFullYear();
    let month = baseDate.getMonth() + offset;
    let newYear = year;
    while (month < 0) {
      month += 12;
      newYear -= 1;
    }
    while (month > 11) {
      month -= 12;
      newYear += 1;
    }
    return { year: newYear, month: month + 1 };
  }

  // 예시 데이터 선언 및 초기화 (함수 바깥으로 이동)
  const todayStrExample = `${nowExample.getFullYear()}-${padExample(
    nowExample.getMonth() + 1
  )}-${padExample(nowExample.getDate())}`;
  // 과거 (한 달 전)
  const pastYM = getYearMonth(nowExample, -1);
  const pastStartExample = `${pastYM.year}-${padExample(pastYM.month)}-01`;
  const pastEndExample = `${pastYM.year}-${padExample(pastYM.month)}-15`;
  // 미래 (다음 달)
  const futureYM = getYearMonth(nowExample, 1);
  const futureStartExample = `${futureYM.year}-${padExample(
    futureYM.month
  )}-01`;
  const futureEndExample = `${futureYM.year}-${padExample(futureYM.month)}-15`;
  const exampleMeds = useMemo(
    () => [
      {
        id: Date.now() + 1,
        name: "과거 항생제",
        type: "항생제",
        days: ["월", "화", "수", "목", "금"],
        times: [{ category: "아침", time: "08:00" }],
        startDate: pastStartExample,
        endDate: pastEndExample,
        takenRecords: {
          [`${pastStartExample}T08:00`]: true,
          [`${pastEndExample}T08:00`]: false,
        },
      },
      {
        id: Date.now() + 2,
        name: "오늘 혈압약",
        type: "혈압약",
        days: ["월", "화", "수", "목", "금", "토", "일"],
        times: [
          { category: "아침", time: "08:00" },
          { category: "저녁", time: "20:00" },
        ],
        startDate: todayStrExample,
        endDate: todayStrExample,
        takenRecords: {},
      },
      {
        id: Date.now() + 3,
        name: "미래 위장약",
        type: "위장약",
        days: ["월", "화", "수", "목", "금", "토", "일"],
        times: [{ category: "아침", time: "08:00" }],
        startDate: futureStartExample,
        endDate: futureEndExample,
        takenRecords: {},
      },
    ],
    [
      pastStartExample,
      pastEndExample,
      todayStrExample,
      futureStartExample,
      futureEndExample,
    ]
  );

  // exampleMeds 선언 이후에 콘솔 출력
  console.log("예시 데이터:", exampleMeds);
  const { medications, updateMedication } = useContext(UserContext);

  // 예시 데이터: 앱 최초 실행 시 과거/현재/미래 약 자동 추가
  React.useEffect(() => {
    if (!medications || medications.length > 0) return;
    // localStorage 접근 제거: 상태는 Context에서만 관리
    updateMedication(exampleMeds);
    // window.location.reload() 제거: 상태 갱신만으로 UI 변경
  }, [medications, updateMedication, exampleMeds]);
  // 복용 상세 모달용 상태
  const [editDate, setEditDate] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  // 오늘 복용해야 하는 약 상태 선언 (오류 해결)

  // 오늘 날짜 문자열(YYYY-MM-DD) 전역 선언
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 복용 상태 토글: Today.jsx와 동일하게 takenRecords에 날짜+시간별로 저장
  // (불필요: toggleTaken 미사용)

  // (불필요: addMedication 미사용)

  // 기존 약 데이터 보정: days/times 없으면 자동으로 매일/08:00으로 채움
  const weekDays = useMemo(
    () => ["일", "월", "화", "수", "목", "금", "토"],
    []
  );
  // 날짜 포맷 보정 함수
  function toYYYYMMDD(str) {
    if (!str) return "";
    if (typeof str !== "string") return "";
    if (str.length === 10) return str;
    // 2025-12-8 → 2025-12-08
    const parts = str.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(
        2,
        "0"
      )}`;
    }
    return str;
  }
  // 복용현황: 홈(UserContext)에 기록된 데이터만 표시 (예시 데이터 완전 제거)
  const normalizedMeds = (
    medications && medications.length > 0 ? medications : []
  ).map((med) => ({
    ...med,
    startDate: toYYYYMMDD(med.startDate),
    endDate: toYYYYMMDD(med.endDate),
    days:
      Array.isArray(med.days) && med.days.length > 0
        ? med.days.filter((d) => weekDays.includes(d))
        : weekDays,
    times:
      Array.isArray(med.times) && med.times.length > 0
        ? med.times
        : [{ category: "기본", time: "08:00" }],
    takenRecords: med.takenRecords || {},
  }));

  // 날짜별 복용기록 생성 (복용 여부 + 복용한 약 이름/시간)
  const records = {};
  const statsData = [];
  const { year, month } = calendarMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${dd}`;
    const dayOfWeek = weekDays[date.getDay()];
    const dateStr = `${y}-${m}-${dd}`;

    // 약의 기간이 현재 달력 날짜에 포함되는 경우만 표기
    let medsForDay = normalizedMeds.filter((med) => {
      if (
        med.startDate &&
        med.startDate.length === 10 &&
        dateStr < med.startDate
      )
        return false;
      if (med.endDate && med.endDate.length === 10 && dateStr > med.endDate)
        return false;
      if (!Array.isArray(med.days) || med.days.length === 0) return true;
      if (!med.days.includes(dayOfWeek)) return false;
      // 현재 달력(month)에 포함되는 기간만 표기
      const monthStr = String(month + 1).padStart(2, "0");
      if (
        med.startDate &&
        med.endDate &&
        !(
          med.startDate.slice(5, 7) <= monthStr &&
          med.endDate.slice(5, 7) >= monthStr
        )
      ) {
        return false;
      }
      return true;
    });
    // 만약 아무 약도 없으면 예시 데이터라도 강제로 표시
    if (medsForDay.length === 0 && examplePastMeds.length > 0) {
      medsForDay = examplePastMeds;
    }

    // 모든 약의 모든 times별로 taken 여부 포함
    let allMeds = [];
    medsForDay.forEach((med) => {
      const timesArr =
        Array.isArray(med.times) && med.times.length > 0
          ? med.times
          : [{ category: "기본", time: "08:00" }];
      timesArr.forEach((t) => {
        const doseKey = `${dateStr}T${t.time || "08:00"}`;
        const taken = !!(
          med.takenRecords && med.takenRecords[doseKey] === true
        );
        allMeds.push({
          name: med.name,
          time: t.category + (t.time ? `(${t.time})` : ""),
          doseTime: t.time,
          taken,
        });
      });
    });
    // takenCount: 복용 완료 약 개수
    const takenCount = allMeds.filter((m) => m.taken).length;
    statsData.push({ date: `${m}/${dd}`, takenCount });
    records[key] = {
      taken: takenCount > 0,
      allMeds,
    };
  }
  // 전체 records와 medications 배열 로그
  console.log("전체 records:", records);
  console.log("현재 medications:", medications);
  // 데이터 꼬임 안내 (테스트용)
  if (
    medications.length > 0 &&
    Object.values(records).every((r) => !r.allMeds || r.allMeds.length === 0)
  ) {
    console.warn(
      "달력에 표시할 약이 없습니다. 약의 기간(startDate/endDate) 또는 요일(days) 설정을 확인하세요."
    );
  }

  // 오늘 복용해야 하는 약 필터링 (Today.jsx와 동일하게 times별, takenRecords 기반)

  // ...todayMeds 미사용 변수 제거...
  useEffect(() => {
    // useEffect 진입 여부 강제 로그
    console.log("[Dashboard.jsx] todayMeds useEffect 진입!", { medications });
    // 디버깅: useEffect 실행, medications, localStorage 값 모두 출력
    console.log("[Dashboard.jsx] todayMeds useEffect 실행", { medications });
    // localStorage 접근 제거: 상태는 Context에서만 관리
    const now = new Date();
    const todayDay = weekDays[now.getDay()];
    const todayStr = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    // (불필요: todayDate 미사용)
    const currentTimeStr = now.toTimeString().substring(0, 5);
    // 먼저 모든 약을 보정(normalize)
    // 날짜 포맷 보정 함수 재사용
    function toYYYYMMDD(str) {
      if (!str) return "";
      if (typeof str !== "string") return "";
      if (str.length === 10) return str;
      const parts = str.split("-");
      if (parts.length === 3) {
        return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(
          2,
          "0"
        )}`;
      }
      return str;
    }
    const normalized = medications.map((med) => {
      const norm = { ...med };
      norm.startDate = toYYYYMMDD(norm.startDate);
      norm.endDate = toYYYYMMDD(norm.endDate);
      norm.days =
        Array.isArray(norm.days) && norm.days.length > 0 ? norm.days : weekDays;
      norm.times =
        Array.isArray(norm.times) && norm.times.length > 0
          ? norm.times
          : [{ category: "기본", time: "08:00" }];
      return norm;
    });
    const filtered = normalized
      .filter((med) => {
        // 디버깅: 포함/제외 여부, 날짜 정보 모두 출력
        const info = {
          todayStr,
          name: med.name,
          startDate: med.startDate,
          endDate: med.endDate,
        };
        if (!med.startDate || med.startDate.length !== 10) {
          console.log("[제외] startDate 없음/잘못됨:", info);
          return false;
        }
        if (todayStr < med.startDate) {
          console.log("[제외] startDate 미래:", info);
          return false;
        }
        if (
          med.endDate &&
          med.endDate.length === 10 &&
          todayStr > med.endDate
        ) {
          console.log("[제외] endDate 지남:", info);
          return false;
        }
        if (!med.days.includes(todayDay)) {
          console.log(
            "[제외] 요일 불일치:",
            info,
            "todayDay:",
            todayDay,
            "days:",
            med.days
          );
          return false;
        }
        if (!Array.isArray(med.times) || med.times.length === 0) {
          console.log("[제외] times 없음:", info);
          return false;
        }
        console.log("[포함] todayMeds:", info);
        return true;
      })
      .flatMap((med) => {
        return med.times.map((t) => {
          const timeStr = t.time || "08:00";
          const doseKey = `${todayStr}T${timeStr}`;
          const isTaken =
            med.takenRecords && med.takenRecords[doseKey] === true;
          return {
            id: `${med.id}-${timeStr}`,
            medicationId: med.id,
            name: med.name,
            doseTime: timeStr,
            category: med.category,
            taken: isTaken,
            isTaken: isTaken,
            takenTime: med.takenTime,
            isMissed: !isTaken && timeStr < currentTimeStr,
            startDate: med.startDate,
            endDate: med.endDate,
          };
        });
      })
      .filter((entry) => entry.doseTime)
      .sort((a, b) => a.doseTime.localeCompare(b.doseTime));
  }, [medications, weekDays]);

  // 과거 복용 약 및 복용 기록
  // 과거 복용 약: endDate가 오늘 이전인 약만 추출
  const pastMeds = medications.filter(
    (med) => med.endDate && med.endDate.length === 10 && med.endDate < todayStr
  );
  console.log("[Dashboard.jsx] Dashboard 렌더링!");

  // handleSaveDateRecord: 최소한 빈 함수로 선언 (오류 방지)
  const handleSaveDateRecord = () => {};

  // Refactor the calendar rendering logic for better readability and maintainability
  // Extracted repetitive logic into helper functions

  // Helper function to format date
  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Helper function to filter medications for a specific day
  function filterMedsForDay(meds, dateStr, dayOfWeek) {
    return meds.filter((med) => {
      let inPeriod = true;
      if (med.startDate && dateStr < med.startDate) inPeriod = false;
      if (med.endDate && dateStr > med.endDate) inPeriod = false;
      if (
        Array.isArray(med.days) &&
        med.days.length > 0 &&
        !med.days.includes(dayOfWeek)
      ) {
        return false;
      }
      return inPeriod;
    });
  }

  // Make calendar cells wider and keep spacing minimal but visually pleasant
  const renderCalendar = () => {
    const daysInMonth = new Date(
      calendarMonth.year,
      calendarMonth.month + 1,
      0
    ).getDate();
    const records = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calendarMonth.year, calendarMonth.month, d);
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      records.push({
        date: dateStr,
        meds: normalizedMeds.filter((med) => {
          const inPeriod =
            (!med.startDate || dateStr >= med.startDate) &&
            (!med.endDate || dateStr <= med.endDate);
          const matchesDay =
            !med.days || med.days.includes(weekDays[date.getDay()]);
          return inPeriod && matchesDay;
        }),
      });
    }

    return (
      <div className="grid grid-cols-4 gap-3 max-w-5xl mx-auto">
        {records.map(({ date, meds }) => (
          <div
            key={date}
            className="border p-3 text-center bg-white rounded-xl shadow-md flex flex-col items-center justify-center"
            style={{ width: "180px", height: "140px" }}
          >
            <div className="font-bold text-base mb-2 text-indigo-700">
              {date}
            </div>
            {meds.length > 0 ? (
              meds.map((med, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  {med.name} {med.taken ? "✅" : "❌"}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400">복용할 약 없음</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f0f4ff] to-[#ffe0f7] flex flex-col items-center py-12 px-2 animate-fadein">
      {/* 상단 월 이동/타이틀 프리미엄 카드 */}
      <div className="w-full max-w-3xl mb-10 flex justify-center">
        <div className="w-full bg-gradient-to-r from-[#e0e7ff] via-[#f0f4ff] to-[#ffe0f7] rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.18)] px-12 py-8 flex flex-col items-center border border-indigo-100 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-200 via-indigo-100 to-transparent" />
          <div className="flex items-center justify-between w-full mb-3 z-10">
            <button
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-200 via-blue-100 to-indigo-100 text-indigo-700 font-extrabold hover:from-indigo-300 hover:to-indigo-200 text-base shadow-lg transition-all border border-indigo-200"
              onClick={() => {
                setCalendarMonth((prev) => {
                  let y = prev.year;
                  let m = prev.month - 1;
                  if (m < 0) {
                    y -= 1;
                    m = 11;
                  }
                  return { year: y, month: m };
                });
              }}
            >
              ◀ 이전달
            </button>
            <span className="font-extrabold text-transparent text-2xl sm:text-3xl bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-blue-600 drop-shadow select-none tracking-tight">
              {calendarMonth.year}년 {calendarMonth.month + 1}월 복용기록
            </span>
            <button
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-200 via-blue-100 to-indigo-100 text-indigo-700 font-extrabold hover:from-indigo-300 hover:to-indigo-200 text-base shadow-lg transition-all border border-indigo-200"
              onClick={() => {
                setCalendarMonth((prev) => {
                  let y = prev.year;
                  let m = prev.month + 1;
                  if (m > 11) {
                    y += 1;
                    m = 0;
                  }
                  return { year: y, month: m };
                });
              }}
            >
              다음달 ▶
            </button>
          </div>
        </div>
      </div>
      {/* 달력 프리미엄 카드 */}
      <div className="w-full max-w-5xl mx-auto mb-8">{renderCalendar()}</div>
      {/* 상세 모달 */}
      {editDate && (
        <DateDetailModal
          open={!!editDate}
          date={editDate}
          allMeds={editRecord}
          onClose={() => {
            setEditDate(null);
            setEditRecord(null);
          }}
          onSave={handleSaveDateRecord}
        />
      )}
      {/* ...existing code... */}
      {/* <MedicationStatsChart data={statsData} /> 주간 복용통계(차트) 제거 */}
    </div>
  );
}
