import React, { useState, useEffect } from "react";

export default function AddMedicationModal({ onAdd, onClose, editMed }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("약");
  const [customType, setCustomType] = useState("");
  const [typeOptions, setTypeOptions] = useState([
    { label: "진통제", icon: "💊" },
    { label: "감기약", icon: "🤧" },
    { label: "치료제", icon: "🩺" },
    { label: "항생제", icon: "💉" },
    { label: "혈압약", icon: "🩸" },
    { label: "간장약", icon: "🧬" },
    { label: "소화제", icon: "🥤" },
    { label: "영양제", icon: "🥗" },
    { label: "비타민", icon: "🍊" },
    { label: "홍삼", icon: "🧧" },
    { label: "기타", icon: "🧃" },
  ]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [timeInputs, setTimeInputs] = useState({
    아침: "",
    점심: "",
    저녁: "",
    "취침 전": "",
  });
  const [customTimes, setCustomTimes] = useState({
    아침: { ampm: "", hour: "", minute: "" },
    점심: { ampm: "", hour: "", minute: "" },
    저녁: { ampm: "", hour: "", minute: "" },
    "취침 전": { ampm: "", hour: "", minute: "" },
  });

  // 약 이름에 따라 분류 자동 지정 (써스펜 → 진통제)
  // 약 이름이 '써스펜'일 때만 자동으로 진통제 지정, 그 외에는 사용자가 선택한 타입을 유지
  useEffect(() => {
    if (name && name.toLowerCase().includes("써스펜")) {
      setType("진통제");
    }
    // 그 외에는 자동 지정하지 않음
  }, [name]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!editMed || typeof editMed !== "object") return;
    setName(editMed.name || "");
    setType(editMed.type || "약");
    setSelectedDays(Array.isArray(editMed.days) ? editMed.days : []);
    setStartDate(editMed.startDate || "");
    setEndDate(editMed.endDate || "");
    if (Array.isArray(editMed.times)) {
      setSelectedTimes(editMed.times.map((t) => t.category));
      const newTimeInputs = { 아침: "", 점심: "", 저녁: "", "취침 전": "" };
      const newCustomTimes = {
        아침: { ampm: "", hour: "", minute: "" },
        점심: { ampm: "", hour: "", minute: "" },
        저녁: { ampm: "", hour: "", minute: "" },
        "취침 전": { ampm: "", hour: "", minute: "" },
      };
      editMed.times.forEach((t) => {
        newTimeInputs[t.category] = t.time;
        // 시간 파싱: "08:00" 또는 "19:30" 등
        if (typeof t.time === "string" && t.time.length >= 4) {
          let [h, m] = t.time.split(":");
          h = parseInt(h, 10);
          let ampm = "오전";
          let hour = h;
          if (h === 0) {
            ampm = "오전";
            hour = 12;
          } else if (h < 12) {
            ampm = "오전";
            hour = h;
          } else if (h === 12) {
            ampm = "오후";
            hour = 12;
          } else if (h > 12) {
            ampm = "오후";
            hour = h - 12;
          }
          newCustomTimes[t.category] = {
            ampm,
            hour: hour.toString().padStart(2, "0"),
            minute: m,
          };
        }
      });
      setTimeInputs(newTimeInputs);
      setCustomTimes(newCustomTimes);
    }
  }, [editMed]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleCustomTimeChange = (category, field, value) => {
    setCustomTimes((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
    const { ampm, hour, minute } = { ...customTimes[category], [field]: value };
    if (ampm && hour && minute) {
      let h = parseInt(hour, 10);
      if (ampm === "오후" && h < 12) h += 12;
      if (ampm === "오전" && h === 12) h = 0;
      const timeStr = `${h.toString().padStart(2, "0")}:${minute}`;
      setTimeInputs((prev) => ({ ...prev, [category]: timeStr }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-200/60 via-white/60 to-pink-200/60 flex justify-center items-center z-[100] backdrop-blur-sm">
      <div
        className="bg-white/90 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-md shadow-2xl border border-blue-100/40 relative animate-fade-in"
        style={{ boxShadow: "0 8px 32px 0 #6366f155" }}
      >
        <h2 className="text-3xl font-extrabold mb-7 text-indigo-700 tracking-tight drop-shadow flex items-center gap-2 justify-center">
          <span className="text-2xl">🥕</span> 챙겨먹기{" "}
          <span className="text-lg font-bold text-indigo-400">
            {editMed ? "수정" : "추가"}
          </span>
        </h2>
        <div className="mb-4 flex flex-col gap-2">
          <span className="font-bold text-indigo-700 mb-1">분류</span>
          <div className="flex gap-2 flex-wrap mb-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={`px-4 py-2 rounded-2xl font-bold border text-base transition-all duration-200 shadow select-none focus:outline-none flex items-center gap-2 min-w-[70px] min-h-[44px] ${
                  type === opt.label
                    ? "bg-indigo-500 text-white border-indigo-500 scale-105 shadow"
                    : "bg-white text-indigo-500 border-indigo-200 hover:bg-indigo-50 hover:scale-105"
                }`}
                onClick={() => setType(opt.label)}
              >
                <span>{opt.icon}</span> {opt.label}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-2 rounded-2xl font-bold border text-base bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 transition-all flex items-center gap-1 min-w-[44px] min-h-[44px]"
              onClick={() => setShowNameInput((prev) => !prev)}
            >
              <span className="text-xl">+</span>
            </button>
            {showNameInput && (
              <div className="flex gap-2 items-center mt-1">
                <input
                  className="border-2 border-indigo-200 rounded-xl p-2 text-base w-36 focus:border-indigo-400 focus:outline-none bg-white/80 placeholder:text-indigo-300 shadow-inner"
                  placeholder="직접 추가"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customType.trim()) {
                      const exists = typeOptions.some(
                        (opt) => opt.label === customType.trim()
                      );
                      if (!exists) {
                        setTypeOptions([
                          ...typeOptions,
                          { label: customType.trim(), icon: "🆕" },
                        ]);
                        setType(customType.trim());
                      }
                      setCustomType("");
                      setShowNameInput(false);
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded-xl font-bold border text-base bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 transition-all"
                  onClick={() => {
                    if (!customType.trim()) return;
                    const exists = typeOptions.some(
                      (opt) => opt.label === customType.trim()
                    );
                    if (!exists) {
                      setTypeOptions([
                        ...typeOptions,
                        { label: customType.trim(), icon: "🆕" },
                      ]);
                      setType(customType.trim());
                    }
                    setCustomType("");
                    setShowNameInput(false);
                  }}
                >
                  추가
                </button>
              </div>
            )}
          </div>
        </div>
        <input
          className="border-2 border-indigo-200 focus:border-indigo-400 w-full mb-4 p-3 rounded-2xl bg-white/80 shadow-inner text-lg placeholder:text-indigo-300 focus:outline-none transition-all duration-200"
          placeholder="챙겨먹기 항목 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-4 mb-6">
          <div className="flex flex-col flex-1">
            <label className="font-bold text-indigo-700 mb-1">시작일</label>
            <input
              type="date"
              className="border-2 border-indigo-200 focus:border-indigo-400 rounded-xl p-2 bg-white/80 shadow-inner text-base focus:outline-none transition-all duration-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="font-bold text-indigo-700 mb-1">종료일</label>
            <input
              type="date"
              className="border-2 border-indigo-200 focus:border-indigo-400 rounded-xl p-2 bg-white/80 shadow-inner text-base focus:outline-none transition-all duration-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-6">
          <span className="font-bold text-indigo-700 mb-2 block">
            복용 요일 선택
          </span>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-2 mb-1">
              {["월", "화", "수", "목"].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`px-4 py-2 rounded-2xl font-bold border text-base transition-all duration-200 select-none focus:outline-none min-w-[44px] min-h-[44px] scale-105 shadow ${
                    selectedDays.includes(day)
                      ? "bg-blue-800 text-white border-blue-800"
                      : "bg-white text-blue-800 border-blue-200 hover:bg-blue-100 hover:scale-105"
                  }`}
                  style={
                    selectedDays.includes(day)
                      ? { backgroundColor: "#2563eb", color: "#fff" }
                      : {}
                  }
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {["금", "토", "일"].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`px-4 py-2 rounded-2xl font-bold border text-base transition-all duration-200 select-none focus:outline-none min-w-[44px] min-h-[44px] scale-105 shadow ${
                    selectedDays.includes(day)
                      ? "bg-blue-800 text-white border-blue-800"
                      : "bg-white text-blue-800 border-blue-200 hover:bg-blue-100 hover:scale-105"
                  }`}
                  style={
                    selectedDays.includes(day)
                      ? { backgroundColor: "#2563eb", color: "#fff" }
                      : {}
                  }
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <span className="font-bold text-indigo-700 mb-2 block">
            복용 시간 선택
          </span>
          <div className="flex gap-2 flex-wrap justify-center mb-2">
            {["아침", "점심", "저녁", "취침 전"].map((time) => (
              <button
                key={time}
                type="button"
                className={`px-4 py-2 rounded-2xl font-bold border text-base transition-all duration-200 select-none focus:outline-none min-w-[44px] min-h-[44px] scale-105 shadow ${
                  selectedTimes.includes(time)
                    ? "bg-pink-500 text-white border-pink-600"
                    : "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 hover:scale-105"
                }`}
                style={
                  selectedTimes.includes(time)
                    ? { backgroundColor: "#ec4899", color: "#fff" }
                    : {}
                }
                onClick={() => toggleTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 items-center">
            {["아침", "점심", "저녁", "취침 전"]
              .filter((t) => selectedTimes.includes(t))
              .map((time) => (
                <div key={time} className="flex gap-2 items-center">
                  <label className="font-bold text-pink-700 text-base min-w-[60px]">
                    {time}
                  </label>
                  <select
                    className="border-2 border-pink-200 rounded-xl p-2 text-base bg-white/70 shadow-inner focus:outline-none"
                    value={customTimes[time].ampm}
                    onChange={(e) =>
                      handleCustomTimeChange(time, "ampm", e.target.value)
                    }
                  >
                    <option value="">선택</option>
                    <option value="오전">오전</option>
                    <option value="오후">오후</option>
                  </select>
                  <select
                    className="border-2 border-pink-200 rounded-xl p-2 text-base bg-white/70 shadow-inner focus:outline-none"
                    value={customTimes[time].hour}
                    onChange={(e) =>
                      handleCustomTimeChange(time, "hour", e.target.value)
                    }
                  >
                    <option value="">시</option>
                    {[...Array(12)].map((_, i) => (
                      <option
                        key={i + 1}
                        value={(i + 1).toString().padStart(2, "0")}
                      >
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border-2 border-pink-200 rounded-xl p-2 text-base bg-white/70 shadow-inner focus:outline-none"
                    value={customTimes[time].minute}
                    onChange={(e) =>
                      handleCustomTimeChange(time, "minute", e.target.value)
                    }
                  >
                    <option value="">분</option>
                    {[...Array(12)].map((_, i) => (
                      <option
                        key={i}
                        value={(i * 5).toString().padStart(2, "0")}
                      >
                        {(i * 5).toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-pink-100 hover:text-pink-600 transition-all text-base"
                    onClick={() => {
                      setSelectedTimes((prev) =>
                        prev.filter((t) => t !== time)
                      );
                      setTimeInputs((prev) => ({ ...prev, [time]: "" }));
                      setCustomTimes((prev) => ({
                        ...prev,
                        [time]: { ampm: "", hour: "", minute: "" },
                      }));
                    }}
                    aria-label={`${time} 삭제`}
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-end items-center mt-4">
          <button
            className="px-6 py-2 rounded-2xl font-bold shadow border transition-all duration-200 text-lg tracking-wide select-none bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-gray-300 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800 hover:scale-105"
            style={{ minWidth: 100, boxShadow: "0 2px 8px 0 #d1d5db33" }}
            onClick={onClose}
            type="button"
          >
            취소
          </button>
          <button
            className={`px-6 py-2 rounded-2xl font-bold shadow-lg border transition-all duration-200 text-lg tracking-wide select-none ${
              !name ||
              selectedTimes.length === 0 ||
              selectedTimes.every((t) => !timeInputs[t])
                ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-105"
            }`}
            style={{
              minWidth: 100,
              boxShadow:
                !name ||
                selectedTimes.length === 0 ||
                selectedTimes.every((t) => !timeInputs[t])
                  ? "none"
                  : "0 4px 16px 0 #6366f133",
            }}
            onClick={() => {
              // 이름, 기간, 요일, 시간 등 필수값이 비어 있어도 기본값 자동 세팅
              const safeName = name && name.trim() ? name : "이름없는 약";
              // type 값이 반드시 사용자가 선택한 값으로 저장되도록 보장
              const safeType = typeof type === "string" ? type.trim() : "기타";
              let days = selectedDays.filter(Boolean);
              if (!days || days.length === 0) {
                days = ["일", "월", "화", "수", "목", "금", "토"];
              }
              let times = selectedTimes
                .filter((t) => timeInputs[t])
                .map((t) => ({ category: t, time: timeInputs[t] }));
              if (!times || times.length === 0) {
                times = [{ category: "아침", time: "08:00" }];
              }
              const today = new Date();
              const pad = (n) => String(n).padStart(2, "0");
              const safeStartDate =
                startDate && startDate.length === 10
                  ? startDate
                  : `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
                      today.getDate()
                    )}`;
              const safeEndDate =
                endDate && endDate.length === 10
                  ? endDate
                  : `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
                      today.getDate()
                    )}`;
              // 디버깅: type 값 콘솔 출력
              console.log("추가되는 약 type:", safeType);
              onAdd({
                ...(editMed && editMed.id
                  ? { id: editMed.id }
                  : { id: Date.now().toString() }),
                name: safeName,
                type: safeType,
                times,
                days,
                startDate: safeStartDate,
                endDate: safeEndDate,
              });
              setName("");
              setType("기타");
              setSelectedDays([]);
              setSelectedTimes([]);
              setTimeInputs({ 아침: "", 점심: "", 저녁: "", "취침 전": "" });
              onClose();
            }}
            type="button"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
