import React, { useState, useContext, useMemo } from "react";
import { UserContext } from "../UserContext";
import TodayStats from "../components/TodayStats";
import MedicationList from "../components/MedicationList";

import CategoryStats from "../components/CategoryStats"; // CategoryStats 컴포넌트 임포트 추가
import MedicationMemoModal from "../components/MedicationMemoModal";

export default function Today() {
  // 약 삭제 함수 (오늘의 리스트에서 해당 약 삭제)
  const { medications, updateMedication } = useContext(UserContext);

  // 복용/미복용 토글 함수 (컴포넌트 내부에서 context 사용)
  const handleToggleTaken = (medicationId, doseTime) => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    const doseKey = `${todayString}T${doseTime || "08:00"}`;
    updateMedication((prevMeds) => {
      const updated = prevMeds.map((med) => {
        if (med.id === medicationId) {
          const takenRecords = { ...(med.takenRecords || {}) };
          takenRecords[doseKey] = !(takenRecords[doseKey] === true);
          return { ...med, takenRecords };
        }
        return med;
      });
      // localStorage에도 즉시 반영
      try {
        const userKey = window.localStorage.getItem("current_user")
          ? `medications_${
              JSON.parse(window.localStorage.getItem("current_user")).email
            }`
          : "medications";
        window.localStorage.setItem(userKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const [selectedMedication, setSelectedMedication] = useState(null);

  // 현재 날짜 및 시간
  const today = useMemo(() => new Date(), []);
  const currentTimeStr = today.toTimeString().substring(0, 5); // 'HH:MM'

  // 약 복용 여부를 확인하는 함수
  const checkIsTaken = (med, time, today) => {
    const todayString = today.toISOString().split("T")[0];
    const doseKey = `${todayString}T${time}`;
    return !!(med.takenRecords && med.takenRecords[doseKey] === true);
  };

  // 2. 오늘의 약 목록 필터링 및 복용 상태 강화
  const enhancedMeds = useMemo(() => {
    const todayDay = today.toLocaleDateString("ko-KR", { weekday: "short" });
    const todayStr = today.toISOString().split("T")[0];
    const filteredMeds = (medications || []).filter(
      (med) =>
        med.days &&
        med.days.includes(todayDay) &&
        med.startDate <= todayStr &&
        med.endDate >= todayStr
    );

    // times가 없거나 비어있으면 기본값 추가
    const enhanced = filteredMeds.flatMap((med) => {
      const timesArr =
        Array.isArray(med.times) && med.times.length > 0
          ? med.times
          : [{ category: "아침", time: "08:00" }];
      return timesArr
        .map((t, idx) => {
          // doseTime별로 takenRecords가 완전히 독립적으로 동작하도록 보장
          const taken = checkIsTaken(med, t.time, today);
          return {
            id: `${med.id}-${t.time}-${idx}`,
            medicationId: med.id,
            name: med.name,
            doseTime: t.time,
            type: med.type,
            taken,
            takenTime: med.takenTime,
            isMissed: !taken && t.time < currentTimeStr,
          };
        })
        .filter((entry) => entry.doseTime)
        .sort((a, b) => {
          // 00:00은 항상 맨 뒤, 나머지는 시간 오름차순
          const tA = a.doseTime || "00:00";
          const tB = b.doseTime || "00:00";
          if (tA === "00:00" && tB !== "00:00") return 1;
          if (tB === "00:00" && tA !== "00:00") return -1;
          return tA.localeCompare(tB);
        });
    });
    return enhanced;
  }, [medications, today, currentTimeStr]);

  const handleSaveMemo = (id, memo) => {
    const updatedMedications = medications.map((med) =>
      med.id === id ? { ...med, memo } : med
    );
    updateMedication(updatedMedications);
  };

  // 3. JSX 렌더링 (고급 카드형 UI)
  return (
    <div className="today-page min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 flex flex-col items-center py-8 px-2">
      {/* 상단 타이틀 카드 */}
      <div className="w-full max-w-2xl mb-8 flex justify-center">
        <div className="w-full bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 rounded-3xl shadow-2xl px-8 py-6 flex flex-col items-center border border-indigo-100">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 tracking-tight drop-shadow-lg text-center">
            오늘의 약 복용
          </h1>
          <span className="text-sm text-gray-400 font-semibold">
            오늘 복약을 잊지 마세요!
          </span>
        </div>
      </div>

      {/* 메인 카드 컨테이너 */}
      <main className="w-full max-w-2xl flex flex-col gap-8 p-8 bg-white/80 rounded-3xl shadow-2xl border border-indigo-100">
        <div className="mb-2">
          <TodayStats medications={enhancedMeds} />
        </div>
        <div>
          <MedicationList
            medications={enhancedMeds}
            onToggle={handleToggleTaken}
            renderExtra={(med) => (
              <button
                className="absolute top-2 right-2 p-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow hover:scale-110 transition-transform"
                onClick={() => setSelectedMedication(med)}
                title="메모"
              >
                🖊️
              </button>
            )}
          />
        </div>
        <div>
          <CategoryStats medications={enhancedMeds} />
        </div>
      </main>

      {/* 메모 모달 */}
      {selectedMedication && (
        <MedicationMemoModal
          medication={selectedMedication}
          onClose={() => setSelectedMedication(null)}
          onSave={handleSaveMemo}
        />
      )}
    </div>
  );
}
