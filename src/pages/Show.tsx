import type { AttendSummary } from "../component/types";
import ToggleButton from "../component/ToggleButton";
import { useState } from "react";
import PieChartCom from "../component/PieChartCom";
import "./design/Show.css"
interface ShowProps {
  data?: AttendSummary;   // undefined 가능
}

function Show({ data }: ShowProps) {
  const [isattend, setIsattend] = useState(false);
  if (!data) return null;
  return (
    <div className="show-container">
      <div className="toggle-wrapper"><ToggleButton checked = {isattend} onChange={() => (setIsattend(prev => !prev))}/></div>
        
        <h2>이수 현황 파이 차트</h2>
        <PieChartCom value={data} isattend = {isattend} category="base"/>
        <PieChartCom value={data} isattend = {isattend} category="major"/>
        <PieChartCom value={data} isattend = {isattend} category="general"/>
        <PieChartCom value={data} isattend = {isattend} category="counsel"/>
    </div>
  )
}

export default Show;
