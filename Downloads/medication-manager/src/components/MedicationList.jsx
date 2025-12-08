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
      {meds.map((med) =>
        typeof med === "object" && med !== null ? (
          <li
            key={
              med.id ||
              (med.medicationId
                ? `${med.medicationId}-${med.doseTime}`
                : undefined)
            }
            className="relative bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 flex flex-col gap-3 transition-transform hover:scale-105 animate-fade-in"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-500 text-xl">
                <FiClock />
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
                    onToggle(med.medicationId || med.id, med.doseTime)
                  }
                  className={`px-4 py-2 rounded-full font-semibold text-sm shadow-md transition-all transform hover:scale-105 ${
                    med.isTaken
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700"
                      : "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700"
                  }`}
                  title={med.isTaken ? "복용 완료" : "미복용"}
                >
                  {med.isTaken ? "복용 완료" : "미복용"}
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
        ) : null
      )}
    </ul>
  );
}
