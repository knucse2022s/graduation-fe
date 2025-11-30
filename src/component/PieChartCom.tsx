import { PieChart, Pie, Cell } from "recharts";
import type { AttendSummary } from "./types"
import "./PieChartCom.css"
interface PieChartComProps {
  value: AttendSummary;
  category: "major" | "base" | "general" | "counsel";
  isattend: boolean;
}

export default function PieChartCom({ value, category, isattend }: PieChartComProps) {
  const COLORS = ["#E0E0E0", "#4CAF50"];

  let total = 0;
  let completed = 0;
  let planned = 0;

  if (category === "major") {
    total = value.totalMajor;
    completed = value.attendMajor;
    planned = value.notAttendMajor;
  } else if (category === "base") {
    total = value.totalBase;
    completed = value.attendBase;
    planned = value.notAttendBase;
  } else if (category === "general") {
    total = value.totalGeneral;
    completed = value.attendGeneral;
    planned = value.notAttendGeneral;
  } else if (category === "counsel") {
    total = 8;
    completed = value.times;
    planned = 0;
  }

  const displayCompleted = Math.min(
    total,
    isattend ? completed + planned : completed
  );
  const remaining = Math.max(total - displayCompleted, 0);

  const data = [
    { name: "이수", value: displayCompleted },
    { name: "남음", value: remaining },
  ];

  const remainderLabel = isattend ? "미래" : "현재";

  return (
    <div className="pie-row">
        <h2>
            {category}
        </h2>
        <div>
            <PieChart width={200} height={200}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={55}
                >
                    {data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    
      <div className="text-box">
        <p>총: {total}</p>
        <p>{remainderLabel}: {remaining}</p>
      </div>
    </div>
  );
}
