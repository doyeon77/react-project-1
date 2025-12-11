// 분류별 이모티콘 매핑 (AddMedicationModal 기준)
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
import React from "react";
import {
  FiTrash2,
  FiEdit2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function MedicationList(props) {
  const { medications, onToggle, onDelete, renderExtra } = props;
  const meds = medications;
  const removeStrayClose = (str) =>
    typeof str === "string" ? str.replace(/\s*\/>/g, "") : "";

  if (!meds || meds.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10 text-lg">
        등록된 약이 없습니다.
      </div>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {meds.map((med) => {
        const isTaken = med.taken;
        // 복용 상태 결정: 오늘 이후는 복용예정, 오늘 이전은 미복용, 오늘은 기존 로직
        let doseDate = null;
        if (med.doseTime && med.doseTime.length === 5) {
          // med.doseTime이 'HH:MM' 형식일 때 날짜 정보가 없으므로, med.startDate/endDate 사용
          doseDate = med.date || null;
        } else if (med.doseTime && med.doseTime.length > 5) {
          // 'YYYY-MM-DDTHH:MM' 형식이면 날짜 추출
          doseDate = med.doseTime.split("T")[0];
        }
        const todayStr = new Date().toISOString().split("T")[0];
        let statusLabel = "미복용";
        let statusColor =
          "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700";
        if (doseDate && doseDate > todayStr) {
          statusLabel = "복용예정";
          statusColor =
            "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500";
        } else if (isTaken) {
          statusLabel = "복용 완료";
          statusColor =
            "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700";
        }
        return typeof med === "object" && med !== null ? (
          <li
            key={`${med.medicationId || med.id}-${med.doseTime}`}
            className="relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 flex flex-col gap-3 transition-transform hover:scale-105 animate-fade-in"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-500 text-xl">
                <FiClock />
              </span>
              {/* 분류별 이모티콘 표시: 공백/오타/undefined 방지 */}
              <span className="text-xl mr-1">
                {(() => {
                  const rawType = med.type || "기타";
                  const cleanType =
                    typeof rawType === "string"
                      ? rawType.replace(/\s/g, "").trim().toLowerCase()
                      : "기타";
                  // 감기 관련 분류 보정 (한글, 영문, 오타, 대소문자, 공백 모두 포함)
                  const coldKeywords = [
                    "감기",
                    "감기약",
                    "감기약",
                    "감기약",
                    "cold",
                    "감기약",
                    "감기약제",
                    "감기약품",
                  ];
                  if (
                    coldKeywords.some((k) =>
                      cleanType.includes(k.replace(/\s/g, "").toLowerCase())
                    )
                  ) {
                    return typeIconMap["감기약"];
                  }
                  return typeIconMap[cleanType] || typeIconMap["기타"];
                })()}
                {/* 디버깅: 실제 type 값 표시 */}
                {/* <span style={{fontSize:'10px',color:'#aaa'}}>{String(med.type)}</span> */}
              </span>
              <span className="font-bold text-lg text-gray-800">
                {typeof med.name === "string" ? removeStrayClose(med.name) : ""}
              </span>
              {med.type && (
                <span className="ml-2 px-2 py-1 rounded-lg text-xs font-bold border border-indigo-200 bg-indigo-50 text-indigo-700">
                  {typeof med.type === "string"
                    ? removeStrayClose(med.type)
                    : ""}
                </span>
              )}
            </div>
            {/* 복용 시간 표시 복원 */}
            <div className="flex flex-col gap-1 text-gray-500">
              <span>복용 시간:</span>
              <span className="font-semibold text-indigo-600">
                {typeof med.doseTime === "string" ? med.doseTime : ""}
              </span>
              {/* 복용 기간 표시 */}
              {med.startDate && med.endDate && (
                <span className="text-xs text-gray-400 mt-1">
                  기간: {med.startDate} ~ {med.endDate}
                </span>
              )}
              {med.startDate && !med.endDate && (
                <span className="text-xs text-gray-400 mt-1">
                  시작일: {med.startDate}
                </span>
              )}
              {!med.startDate && med.endDate && (
                <span className="text-xs text-gray-400 mt-1">
                  종료일: {med.endDate}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              {/* 복용/미복용 토글 버튼: onToggle이 전달된 경우에만 표시 */}
              {onToggle && (
                <button
                  onClick={() =>
                    onToggle(
                      med.medicationId || med.id,
                      med.doseTime || "08:00"
                    )
                  }
                  className={`px-4 py-2 rounded-full font-semibold text-sm shadow-md transition-all transform hover:scale-105 ${statusColor}`}
                  title={statusLabel}
                >
                  {statusLabel}
                </button>
              )}
              {/* 삭제 버튼 */}
              {onDelete && (
                <button
                  onClick={() => onDelete(med.medicationId || med.id)}
                  className="px-4 py-2 rounded-xl font-semibold text-sm shadow bg-gradient-to-r from-pink-400 via-red-400 to-pink-600 text-white transition-all duration-200 hover:from-pink-500 hover:via-red-500 hover:to-pink-800 hover:scale-105 border-none outline-none focus:ring-2 focus:ring-pink-300 flex items-center gap-1"
                  title="삭제"
                >
                  <span style={{ fontSize: "1.1em", marginRight: "0.2em" }}>
                    <FiTrash2 />
                  </span>
                  삭제
                </button>
              )}
              {/* 수정 버튼 (renderExtra) */}
              {renderExtra && typeof renderExtra === "function"
                ? renderExtra(med)
                : null}
            </div>
          </li>
        ) : null;
      })}
    </ul>
  );
}
