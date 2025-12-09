import React from "react";

const PRESET_GROUPS = [
  {
    label: "아침",
    times: [
      "06:00",
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
    ],
  },
  {
    label: "점심",
    times: ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30"],
  },
  {
    label: "저녁",
    times: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"],
  },
  {
    label: "취침 전",
    times: ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30"],
  },
];

export default function TimePresetGroup({ group, value, onChange }) {
  return (
    <div className="mb-4">
      <div className="font-bold text-indigo-700 mb-2 text-base">
        {group.label}
      </div>
      <div className="flex flex-wrap gap-2">
        {group.times.map((t) => (
          <button
            key={t}
            type="button"
            className={`px-3 py-1 rounded-xl font-bold border text-base transition-all duration-150 shadow-sm select-none focus:outline-none ${
              value === t
                ? "bg-indigo-500 text-white border-indigo-500 scale-105 shadow"
                : "bg-white text-indigo-500 border-indigo-200 hover:bg-indigo-50 hover:scale-105"
            }`}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
