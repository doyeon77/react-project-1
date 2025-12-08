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
    const updatedMedications = medications.map((med) => {
      if (med.id === medicationId) {
        const takenRecords = med.takenRecords ? { ...med.takenRecords } : {};
        const isTaken = !(takenRecords[doseKey] === true);
        takenRecords[doseKey] = isTaken;
        return { ...med, takenRecords };
      }
      return med;
    });
    updateMedication(updatedMedications);
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
    const todayDay = today.toLocaleDateString("ko-KR", { weekday: "short" }); // 오늘 요일(짧은 형식)
    const todayStr = today.toISOString().split("T")[0];
    const filteredMeds = (medications || []).filter(
      (med) =>
        med.days &&
        med.days.includes(todayDay) &&
        med.startDate <= todayStr &&
        med.endDate >= todayStr
    );

    const enhanced = filteredMeds.flatMap((med) =>
      (med.times || [])
        .map((t) => {
          const isTaken = checkIsTaken(med, t.time, today);
          return {
            id: `${med.id}-${t.time}`,
            medicationId: med.id,
            name: med.name,
            doseTime: t.time,
            category: med.category,
            isTaken: isTaken,
            takenTime: med.takenTime, // takenTime 추가
            isMissed: !isTaken && t.time < currentTimeStr,
          };
        })
        .filter((entry) => entry.doseTime) // 유효하지 않은 복용 시간을 제거
        .sort((a, b) => a.doseTime.localeCompare(b.doseTime))
    ); // flatMap 종료

    // 디버깅: medications, filteredMeds, enhanced 데이터 확인
    console.log("Medications:", medications);
    console.log("Filtered Medications:", filteredMeds);
    console.log("Enhanced Medications:", enhanced);

    return enhanced; // 최종 결과 반환
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
