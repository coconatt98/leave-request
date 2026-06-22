"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type DepartmentBarChartProps = {
  data: Array<{ department: string; count: number }>;
};

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        No department data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="department" 
            tick={{ fill: "#64748b", fontSize: 12 }} 
            tickMargin={10} 
            axisLine={{ stroke: "#334155", opacity: 0.5 }}
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={{ stroke: "#334155", opacity: 0.5 }}
          />
          <Tooltip 
            cursor={{ fill: "rgba(255, 90, 95, 0.05)" }}
            contentStyle={{ 
              backgroundColor: "rgba(30, 41, 59, 0.9)", 
              border: "none", 
              borderRadius: "8px",
              color: "#fff"
            }}
          />
          <Bar 
            dataKey="count" 
            name="Employees" 
            fill="#0f62fe" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
