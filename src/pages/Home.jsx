// Home 페이지: 전체 약 관리 및 메인 UI
import React, { useContext, useState, useEffect } from "react";
import MedicationCalendar from "../components/MedicationCalendar";
import AddMedicationModal from "../../AddMedicationModal";
import WarningBanner from "../components/WarningBanner";
import { UserContext } from "../UserContext";

export default function Home() {
  // 상태 관리 및 주요 변수: 중복 선언 없이 한 번만 선언
  const { medications, updateMedication } = useContext(UserContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [showPastDetails, setShowPastDetails] = useState(null);
  const [pastSearch, setPastSearch] = useState("");
  // 명언 리스트 및 오늘 명언
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
  const todayIdx = new Date().getDate() % quotes.length;
  const todayQuote = quotes[todayIdx];
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const warnings = [];
  const typeIconMap = {
    진통제: "💊",
    감기약: "🤧",
    치료제: "🩺",
    항생제: "💉",
    혈압약: "🩸",
    간장약: "🧬",
    소화제: "🥤",
    영양제: "🥗",
    비타민: "🍊",
    홍삼: "🧧",
    기타: "🧃",
  };

  // 약 삭제
  function handleDeleteMed(id) {
    updateMedication((prevMeds) => prevMeds.filter((med) => med.id !== id));
  }
  // 약 추가/수정
  function handleAddOrEditMed(newMed) {
    if (!newMed) return;
    updateMedication((prevMeds) => {
      if (!prevMeds || !Array.isArray(prevMeds)) return [newMed];
      const exists = prevMeds.find((med) => med.id === newMed.id);
      if (exists) {
        return prevMeds.map((med) => (med.id === newMed.id ? newMed : med));
      } else {
        return [...prevMeds, newMed];
      }
    });
    setShowAddModal(false);
    setEditMed(null);
  }

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
                  key={`${med.id}-${med.startDate}-${med.type}`}
                  className="rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 via-blue-50 to-white border border-indigo-100 p-5 flex flex-col gap-2 relative group hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">
                      {typeIconMap[
                        (med.type || "기타").replace(/\s/g, "").trim()
                      ] || typeIconMap["기타"]}
                    </span>
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
                  {/* 복용/미복용 여부 표시 제거됨 */}
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
        {/* 복용 예정 약 리스트 */}
        {medications.filter((med) => med.startDate > todayStr).length > 0 && (
          <div className="mt-8">
            <h3 className="text-base font-bold text-indigo-500 mb-2 flex items-center gap-2">
              <span className="text-xl">⏳</span> 복용 예정 약
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {medications
                .filter((med) => med.startDate > todayStr)
                .map((med) => (
                  <div
                    key={`${med.id}-${med.startDate}-${med.type}`}
                    className="rounded-2xl shadow bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 border border-indigo-100 p-5 flex flex-col gap-2"
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
                    <div className="text-xs text-blue-400 font-bold mt-2">
                      복용 예정
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
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
        {showPastDetails === "all" && (
          <input
            type="text"
            className="ml-4 px-3 py-2 rounded-lg border border-indigo-200 text-base text-indigo-700 bg-white shadow"
            placeholder="약 이름 또는 분류 검색"
            value={pastSearch}
            onChange={(e) => setPastSearch(e.target.value)}
            style={{ minWidth: "180px" }}
          />
        )}
      </div>
      {showPastDetails === "all" && (
        <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(medications || [])
            .filter((med) => med.endDate && med.endDate < todayStr)
            .filter((med) => {
              // 복용기간에 맞는 날짜만 표시
              const end = new Date(med.endDate);
              const start = new Date(med.startDate);
              return start <= end;
            })
            .filter(
              (med) =>
                pastSearch.trim() === "" ||
                med.name.includes(pastSearch.trim()) ||
                (med.type && med.type.includes(pastSearch.trim()))
            )
            .filter((med) => {
              const lowerName = med.name.toLowerCase();
              return !(
                lowerName.includes("케토톱") || lowerName.includes("알마겔")
              );
            })
            .map((med) => {
              // 약 이름 기반으로 typeOptions 기준 분류 자동 매핑
              function getMainTypeByName(name, type) {
                const lowerName = name.toLowerCase();
                if (
                  lowerName.includes("써스펜") ||
                  lowerName.includes("타이레놀") ||
                  lowerName.includes("게보린") ||
                  lowerName.includes("아스피린")
                )
                  return "진통제";
                if (lowerName.includes("판콜") || lowerName.includes("콜대원"))
                  return "감기약";
                if (lowerName.includes("우루사")) return "간장약";
                if (lowerName.includes("베나치오")) return "감기약";
                if (lowerName.includes("리피토")) return "치료제";
                if (lowerName.includes("글루코파지")) return "치료제";
                if (lowerName.includes("치료")) return "치료제";
                if (lowerName.includes("항생")) return "항생제";
                if (lowerName.includes("혈압")) return "혈압약";
                if (lowerName.includes("소화") || lowerName.includes("정로환"))
                  return "소화제";
                if (lowerName.includes("영양제")) return "영양제";
                if (lowerName.includes("비타민")) return "비타민";
                if (lowerName.includes("홍삼")) return "홍삼";
                return type && typeOptions.some((opt) => opt.label === type)
                  ? type
                  : "기타";
              }
              const mainType = getMainTypeByName(med.name, med.type);
              let subType = "";
              // 세부 분류 표기(예시)
              if (
                mainType === "진통제" &&
                med.name.toLowerCase().includes("써스펜")
              )
                subType = "해열진통제";
              if (
                mainType === "감기약" &&
                (med.name.toLowerCase().includes("판콜") ||
                  med.name.toLowerCase().includes("콜대원"))
              )
                subType = "항히스타민제";
              let displayName = med.name;
              // 리피토, 글루코파지는 소괄호로 관련 질환 표기
              if (mainType === "치료제") {
                if (med.name.toLowerCase().includes("리피토")) {
                  displayName += " (고지혈증)";
                } else if (med.name.toLowerCase().includes("글루코파지")) {
                  displayName += " (당뇨병)";
                } else if (subType) {
                  displayName += ` (${subType})`;
                }
              } else if (subType) {
                displayName += ` (${subType})`;
              }
              return (
                <li
                  key={`${med.id}-${med.startDate}-${med.type}`}
                  className="p-6 rounded-3xl shadow-xl border border-indigo-100 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getMedIcon(mainType)}</span>
                    <span className="font-extrabold text-xl text-indigo-700 drop-shadow">
                      {displayName}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 font-semibold">
                      ({med.startDate} ~ {med.endDate})
                    </span>
                  </div>
                  <div className="text-xs text-indigo-500 mb-2 font-bold">
                    분류: {mainType}
                  </div>
                </li>
              );
            })}
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

// 분류별 이모티콘 매핑 함수 (AddMedicationModal 기준)
// AddMedicationModal의 typeOptions 기준으로 분류/이모티콘 매핑
const typeOptions = [
  { label: "진통제", icon: "💊" },
  { label: "감기약", icon: "🤧" },
  { label: "치료제", icon: "🩺" },
  { label: "항생제", icon: "💉" },
  { label: "혈압약", icon: "🩸" },
  { label: "고지혈증 치료제", icon: "🫀" },
  { label: "당뇨병 치료제", icon: "🩹" },
  { label: "소화제", icon: "🥤" },
  { label: "영양제", icon: "🥗" },
  { label: "비타민", icon: "🍊" },
  { label: "홍삼", icon: "🧧" },
  { label: "간장약", icon: "🧬" },
  { label: "기타", icon: "🧃" },
];

function getMedIcon(type) {
  if (!type) return "💊";
  const found = typeOptions.find((opt) => type === opt.label);
  if (found) return found.icon;
  // 직접 추가된 커스텀 분류는 "🆕"
  return "🆕";
}

// 예시 데이터 생성 함수 (이제는 주석 처리됨)
// function generateSampleData() {
//   const sampleMeds = [
//     {
//       id: 1,
//       name: "아스피린",
//       type: "식사 전",
//       startDate: "2023-10-01",
//       endDate: "2023-10-07",
//     },
//     {
//       id: 2,
//       name: "타이레놀",
//       type: "식사 후",
//       startDate: "2023-10-03",
//       endDate: "2023-10-10",
//     },
//     {
//       id: 3,
//       name: "항생제-엑스",
//       type: "항생제",
//       startDate: "2023-10-05",
//       endDate: "2023-10-12",
//     },
//   ];

//   const today = new Date();
//   const todayStr = `${today.getFullYear()}-${String(
//     today.getMonth() + 1
//   ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

//   // medications 상태 업데이트
//   updateMedication(sampleMeds);

//   // 로컬 스토리지에도 저장 (영구 저장소로 가정)
//   localStorage.setItem("medications", JSON.stringify(sampleMeds));
// }

// 복용 기록 생성 함수 (이제는 주석 처리됨)
// function generateTakenRecords(startDate, endDate, times, type) {
//   ...기존 코드...
