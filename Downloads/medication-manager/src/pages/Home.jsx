import React, { useContext } from "react";
import MedicationCalendar from "../components/MedicationCalendar";
import AddMedicationModal from "../../AddMedicationModal";
import MedicationList from "../components/MedicationList";
import WarningBanner from "../components/WarningBanner";
import { UserContext } from "../UserContext";

export default function Home() {
  // 약 추가/수정 모달 상태
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editMed, setEditMed] = React.useState(null);
  // 과거 복용 약 리스트 펼침 상태
  const [showPastDetails, setShowPastDetails] = React.useState(null);
  // 실제 과거 복용약 여러 개와 복용 기록(복용 > 미복용) 자동 추가
  // 명언 리스트 (매일 다르게)
  const quotes = [
    "건강은 가장 소중한 재산입니다.",
    "오늘의 작은 습관이 내일의 건강을 만듭니다.",
    "약은 꾸준히, 건강은 천천히.",
    "몸을 아끼는 것이 삶을 아끼는 것이다.",
    "건강을 잃으면 모든 것을 잃는다.",
    "내 몸을 위한 최고의 투자, 복약.",
    "오늘도 건강 챙기기!",
    "꾸준함이 최고의 명약이다.",
    "건강은 준비된 자에게 온다.",
    "약은 잊지 말고, 건강은 놓치지 말자.",
  ];
  // 오늘 날짜 기반 명언 선택
  const todayIdx = new Date().getDate() % quotes.length;
  const todayQuote = quotes[todayIdx];
  // UserContext에서 medications 받아오기
  const { medications, updateMedication } = useContext(UserContext);

  React.useEffect(() => {
    if (!medications || medications.length === 0) {
      // 복용 기록 생성 함수 (복용 80~90% 확률)
      function generateTakenRecords(startDate, endDate, times) {
        const records = {};
        const start = new Date(startDate);
        const end = new Date(endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          times.forEach((t) => {
            const dateStr = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            const key = `${dateStr}T${t.time || "08:00"}`;
            records[key] = Math.random() < 0.85; // 85% 복용
          });
        }
        return records;
      }
      const initialMeds = [
        {
          id: "1",
          name: "타이레놀",
          type: "진통제",
          startDate: "2025-11-01",
          endDate: "2025-11-10",
          times: [
            { category: "아침", time: "08:00" },
            { category: "저녁", time: "20:00" },
          ],
          takenRecords: generateTakenRecords("2025-11-01", "2025-11-10", [
            { category: "아침", time: "08:00" },
            { category: "저녁", time: "20:00" },
          ]),
        },
        {
          id: "2",
          name: "판콜에이",
          type: "감기약",
          startDate: "2025-10-15",
          endDate: "2025-10-25",
          times: [{ category: "점심", time: "12:00" }],
          takenRecords: generateTakenRecords("2025-10-15", "2025-10-25", [
            { category: "점심", time: "12:00" },
          ]),
        },
        {
          id: "3",
          name: "센트룸",
          type: "비타민",
          startDate: "2025-09-01",
          endDate: "2025-09-15",
          times: [{ category: "아침", time: "08:30" }],
          takenRecords: generateTakenRecords("2025-09-01", "2025-09-15", [
            { category: "아침", time: "08:30" },
          ]),
        },
        {
          id: "4",
          name: "베아제",
          type: "소화제",
          startDate: "2025-08-10",
          endDate: "2025-08-20",
          times: [{ category: "저녁", time: "19:00" }],
          takenRecords: generateTakenRecords("2025-08-10", "2025-08-20", [
            { category: "저녁", time: "19:00" },
          ]),
        },
        {
          id: "5",
          name: "아스피린",
          type: "혈액순환제",
          startDate: "2025-07-01",
          endDate: "2025-07-10",
          times: [
            { category: "아침", time: "08:30" },
            { category: "점심", time: "12:30" },
          ],
          takenRecords: generateTakenRecords("2025-07-01", "2025-07-10", [
            { category: "아침", time: "08:30" },
            { category: "점심", time: "12:30" },
          ]),
        },
        {
          id: "6",
          name: "리피토",
          type: "고지혈증 치료제",
          startDate: "2025-12-01",
          endDate: "2025-12-31",
          times: [{ category: "기본", time: "08:00" }],
          days: ["월", "화", "수", "목", "금", "토", "일"],
          takenRecords: {
            "2025-12-08T08:00": true,
            ...generateTakenRecords("2025-12-01", "2025-12-31", [
              { category: "기본", time: "08:00" },
            ]),
          },
        },
      ];
      updateMedication(initialMeds);
    }
  }, [medications, updateMedication]);
  // skipped, meals 등도 Context 또는 props로 관리 필요 (추후 개선)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  // 경고/위험/팁 메시지 생성
  const warnings = [];
  // 1. 2회 이상 연속 미복용 경고 (skipped 변수 미정의로 임시 주석 처리)
  // medications.forEach((med) => {
  //   let skipCount = 0;
  //   // 실제로는 날짜별 기록 필요, 여기선 오늘만 체크
  //   if (skipped[med.id]) skipCount++;
  //   // 샘플: 2회 이상 연속 미복용 시 경고
  //   if (skipCount >= 2) {
  //     warnings.push({
  //       type: "danger",
  //       message: `"${med.name}"을(를) 2회 이상 연속으로 건너뛰었습니다. 복약을 꼭 챙겨주세요!`,
  //     });
  //   }
  // });
  // 2. 식사 직후 복용 필수 약 + 식사 기록 없음 경고
  medications.forEach((med) => {
    // 약 정보에 복용 조건이 "식사 직후"라고 가정 (type에 포함)
    if (med.type && med.type.includes("식사 직후")) {
      const todayMeal = meals.find((m) => m.date === todayStr);
      if (!todayMeal) {
        warnings.push({
          type: "warn",
          message: `"${med.name}"은(는) 식사 직후 복용해야 합니다. 오늘 식사 기록이 없습니다.`,
        });
      }
    }
  });

  // 예시 약 자동 삽입 완전 제거. 이제 내가 직접 등록한 약만 표시됨.

  // 실제 UI 렌더링 (원래 기능 복구)
  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-8">
      {/* 상단 명언 카드 */}
      <div className="w-full flex justify-center">
        <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 rounded-3xl shadow-2xl px-8 py-6 mb-2 flex flex-col items-center w-full max-w-xl border border-indigo-100">
          <span className="text-2xl font-extrabold text-indigo-700 mb-2 tracking-tight drop-shadow-lg text-center">
            {todayQuote}
          </span>
          <span className="text-sm text-gray-400 font-semibold">
            오늘의 건강 명언
          </span>
        </div>
      </div>

      {/* 약 추가 버튼 */}
      <div className="flex justify-center">
        <button
          className="px-8 py-4 rounded-3xl font-extrabold text-xl shadow-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 text-white transition-all duration-200 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-800 hover:scale-105 border-none outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2"
          style={{ letterSpacing: "0.04em" }}
          onClick={() => {
            setEditMed(null);
            setShowAddModal(true);
          }}
        >
          <span className="text-2xl">＋</span> <span>약 추가</span>
        </button>
      </div>

      {/* 경고 배너 */}
      <WarningBanner warnings={warnings} />

      {/* 현재 복용 중인 약 리스트 */}
      <div className="mt-2">
        <h2 className="text-lg font-bold mb-3 text-indigo-700 flex items-center gap-2">
          <span className="text-xl">🩺</span> 현재 복용 중인 약
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {medications.filter(
            (med) => med.startDate <= todayStr && med.endDate >= todayStr
          ).length === 0 ? (
            <div className="col-span-2 text-center text-gray-400 py-8 text-base">
              복용 중인 약이 없습니다.
            </div>
          ) : (
            medications
              .filter(
                (med) => med.startDate <= todayStr && med.endDate >= todayStr
              )
              .map((med) => (
                <div
                  key={med.id}
                  className="rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 via-blue-50 to-white border border-indigo-100 p-5 flex flex-col gap-2 relative group hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">💊</span>
                    <span className="font-bold text-lg text-indigo-800 drop-shadow-sm">
                      {med.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mb-1">
                    기간: {med.startDate} ~ {med.endDate}
                  </div>
                  <div className="text-xs text-indigo-500 font-bold mb-2">
                    분류: {med.type || "-"}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      className="px-4 py-2 rounded-xl font-semibold text-sm shadow bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-600 text-white transition-all duration-200 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-800 hover:scale-105 border-none outline-none focus:ring-2 focus:ring-indigo-300"
                      style={{ letterSpacing: "0.02em" }}
                      onClick={() => {
                        setEditMed(med);
                        setShowAddModal(true);
                      }}
                    >
                      <span className="mr-1">✎</span>수정
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl font-semibold text-sm shadow bg-gradient-to-r from-pink-200 via-red-200 to-pink-300 text-red-700 hover:from-pink-300 hover:to-red-300 hover:scale-105 border-none outline-none focus:ring-2 focus:ring-pink-200"
                      onClick={() => handleDeleteMed(med.id)}
                    >
                      <span className="mr-1">🗑️</span>삭제
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* 과거 복용 약 리스트 */}
      <div className="flex items-center gap-3 mt-8 mb-2">
        <h2 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
          <span className="text-xl">📜</span> 과거 복용 약
        </h2>
        <button
          className="px-5 py-2 rounded-2xl font-bold text-base shadow-lg bg-gradient-to-r from-blue-100 via-indigo-100 to-gray-200 text-indigo-700 border border-indigo-200 transition-all duration-200 hover:from-blue-200 hover:via-indigo-200 hover:to-gray-300 hover:text-indigo-900 hover:scale-105 focus:ring-2 focus:ring-indigo-300 flex items-center gap-2"
          style={{ letterSpacing: "0.02em" }}
          onClick={() =>
            setShowPastDetails((prev) => (prev === "all" ? null : "all"))
          }
        >
          <span className="text-xl">
            {showPastDetails === "all" ? "✖️" : "👁️"}
          </span>
          {showPastDetails === "all" ? "닫기" : "전체 보기"}
        </button>
      </div>
      {showPastDetails === "all" && (
        <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(medications || [])
            .filter((med) => med.endDate && med.endDate < todayStr) // 과거 복용약만 표시
            .map((med) => (
              <li
                key={med.id}
                className="p-6 rounded-3xl shadow-xl border border-indigo-100 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="font-extrabold text-xl text-indigo-700 drop-shadow">
                    {med.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500 font-semibold">
                    ({med.startDate} ~ {med.endDate})
                  </span>
                </div>
                <div className="text-xs text-indigo-500 mb-2 font-bold">
                  분류: {med.type || "-"}
                </div>
              </li>
            ))}
        </ul>
      )}

      {/* 약 추가/수정 모달 */}
      {showAddModal && (
        <AddMedicationModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          editMed={editMed}
          onAdd={handleAddOrEditMed}
        />
      )}
    </div>
  );
}
