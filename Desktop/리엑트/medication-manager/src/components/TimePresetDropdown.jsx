import React, { useState, useRef, useEffect } from "react";

const PRESETS = [
  { label: "아침", value: "08:00" },
  { label: "점심", value: "12:00" },
  { label: "저녁", value: "18:00" },
  { label: "취침 전", value: "22:00" },
];

export default function TimePresetDropdown({ value, onChange }) {
  // 프리셋 중 하나가 선택된 상태인지 체크
  const presetActive = PRESETS.some((p) => p.value === value);
  const [open, setOpen] = useState(false);
  // 프리셋이 선택되면 드롭다운 open도 무조건 false로 동기화
  useEffect(() => {
    if (presetActive && open) setOpen(false);
  }, [presetActive, open]);
  const ref = useRef(null);
  const times = Array.from({ length: 48 }).map((_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full" ref={ref}>
      <div className="flex gap-2 mb-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            className={`px-3 py-1 rounded-xl font-bold border text-base transition-all duration-150 shadow-sm select-none focus:outline-none ${
              value === preset.value
                ? "bg-indigo-500 text-white border-indigo-500 scale-105 shadow"
                : "bg-white text-indigo-500 border-indigo-200 hover:bg-indigo-50 hover:scale-105"
            }`}
            onClick={() => {
              setOpen(false);
              onChange(preset.value);
            }}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          className={`px-3 py-1 rounded-xl font-bold border text-base transition-all duration-150 shadow-sm select-none focus:outline-none ${
            !presetActive && !!value
              ? "bg-pink-500 text-white border-pink-500 scale-105 shadow"
              : "bg-white text-pink-500 border-pink-200 hover:bg-pink-50 hover:scale-105"
          }`}
          onClick={() => {
            setOpen(true);
            if (presetActive) onChange("");
          }}
        >
          직접선택
        </button>
      </div>
      {!presetActive && (
        <div className="relative">
          <button
            type="button"
            className={`w-full flex items-center justify-between border-2 rounded-xl p-3 bg-white/80 shadow-lg text-lg font-semibold focus:outline-none transition-all duration-200 cursor-pointer border-blue-200 focus:border-indigo-400 hover:border-blue-400 hover:shadow-xl ${
              !value ? "text-gray-400" : "text-indigo-700"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            {value ? (
              <span className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-1" />
                {value}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-200 mr-1" />
                ⏰ 시간을 선택하세요
              </span>
            )}
            <span
              className="ml-2 text-indigo-400 text-xl transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </button>
          {open && (
            <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl bg-white/95 shadow-2xl border border-indigo-100 animate-fade-in">
              {times.map((t, i) => (
                <li
                  key={t}
                  className={`px-4 py-2 cursor-pointer transition-all duration-150 text-base font-semibold ${
                    value === t
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-indigo-50 text-gray-700"
                  } ${
                    i !== times.length - 1 ? "border-b border-indigo-50" : ""
                  }`}
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
