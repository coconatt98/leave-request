"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type LeaveStatusPieChartProps = {
  pending: number;
  approved: number;
  rejected: number;
};

const COLORS = ["#d97706", "#16a34a", "#dc2626"]; // Amber, Green, Red

export function LeaveStatusPieChart({ pending, approved, rejected }: LeaveStatusPieChartProps) {
  const data = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  // If all values are 0, show a placeholder
  const total = pending + approved + rejected;
  if (total === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        No leave request data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(30, 41, 59, 0.9)", 
              border: "none", 
              borderRadius: "8px",
              color: "#fff"
            }} 
            itemStyle={{ color: "#fff" }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
