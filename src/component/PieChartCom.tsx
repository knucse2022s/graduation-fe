import { PieChart, Pie, Cell } from "recharts";
import type { AttendSummary } from "./types"
import "./PieChartCom.css"
interface PieChartComProps {
  value: AttendSummary;
  category: "major" | "base" | "general" | "counsel";
  isattend: boolean;
}

export default function PieChartCom({ value, category, isattend }: PieChartComProps) {

  const COLORS = ["#E0E0E0","#4CAF50"];

  let total : number = 0;
  let attend : number = 0;

  if (category === "major") {
    total = value.totalMajor;
    attend = isattend
      ? value.attendMajor // 현재 이수
      : value.attendMajor + value.notAttendMajor; // 미래(이수 + 예정)
  }
  else if (category === "base") {
    total = value.totalBase;
    attend = isattend
      ? value.attendBase
      : value.attendBase + value.notAttendBase;
  }
  else if (category === "general") {
    total = value.totalGeneral;
    attend = isattend
      ? value.attendGeneral
      : value.attendGeneral + value.notAttendGeneral;
  }
  else if (category === "counsel") {
    total = 8;
    attend = value.times;
  }

  const notAttend = total - attend;

  const data = [
    { name: "총", value: attend },
    { name: "현재", value: notAttend < 0 ? 0 : notAttend },
  ];
  
  const ret : string = isattend ? "미래" : "현재";

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
        <p>{ret} : {notAttend}</p>
      </div>
    </div>
  );
}
