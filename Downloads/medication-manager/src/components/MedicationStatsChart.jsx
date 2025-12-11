import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// data: [{ date: 'YYYY-MM-DD', takenCount: number }]
export default function MedicationStatsChart({
  data,
  title = "주간 복용 통계",
}) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 animate-fade-in mt-8">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="date" tick={{ fontSize: 14, fill: "#6366f1" }} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 14, fill: "#6366f1" }}
          />
          <Tooltip wrapperClassName="rounded-xl shadow-lg bg-white/90 text-gray-800" />
          <Bar
            dataKey="takenCount"
            fill="url(#colorBar)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
