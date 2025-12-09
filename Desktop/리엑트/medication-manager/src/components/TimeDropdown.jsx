import React, { useState, useRef, useEffect } from "react";

export default function TimeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
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
    <div className="relative" ref={ref}>
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
              } ${i !== times.length - 1 ? "border-b border-indigo-50" : ""}`}
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
  );
}
