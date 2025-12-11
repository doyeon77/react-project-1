import React, { useState } from "react";

export default function MedicationMemoModal({ medication, onClose, onSave }) {
  const [memo, setMemo] = useState(medication.memo || "");

  const handleSave = () => {
    onSave(medication.id, memo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-indigo-200">
        <h2 className="text-2xl font-extrabold text-indigo-700 mb-6 text-center">
          {medication.name} 메모
        </h2>
        <textarea
          className="w-full h-40 p-4 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 shadow-inner"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요..."
        />
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl shadow hover:bg-gray-300 transition-all"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-6 py-2 bg-indigo-500 text-white font-bold rounded-xl shadow hover:bg-indigo-600 transition-all"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
