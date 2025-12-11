import React from "react";

// props: warnings: array of { type, message }
export default function WarningBanner({ warnings }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <div className="mb-6">
      {warnings.map((w, i) => (
        <div
          key={i}
          className={`p-4 rounded-2xl font-bold shadow border-2 mb-2 animate-fade-in ${
            w.type === "danger"
              ? "bg-red-100 border-red-300 text-red-700"
              : w.type === "warn"
              ? "bg-yellow-100 border-yellow-300 text-yellow-700"
              : "bg-blue-100 border-blue-300 text-blue-700"
          }`}
        >
          {w.message}
        </div>
      ))}
    </div>
  );
}
