import type { normalCourse, mustBeCourse, Counsel, AttendSummary } from "./types";

export function calcCredits(
  mustBe: mustBeCourse[],
  normal: normalCourse[],
  counsel: Counsel,
  studentid: number,
  studentMajor: string
) {
  void mustBe;
  const sum = (
    list: normalCourse[],
    status: "기이수" | "이수예정",
    major: "공학전공" | "전공기반" | "교양"
  ) =>
    list
      .filter(c => c.status === status && c.major === major)
      .reduce((acc, cur) => acc + cur.credit, 0);

  const attendMajor = sum(normal, "기이수", "공학전공");
  const notAttendMajor = sum(normal, "이수예정", "공학전공");
  const attendBase = sum(normal, "기이수", "전공기반");
  const notAttendBase = sum(normal, "이수예정", "전공기반");
  const attendGeneral = sum(normal, "기이수", "교양");
  const notAttendGeneral = sum(normal, "이수예정", "교양");
  const times = counsel.times;


    const year = parseInt(String(studentid).slice(2,4));

    if(studentMajor === "글로벌소프트웨어"){
        if(year <= 22){
            const totalMajor = 60;
            const totalBase = 12;
            const totalGeneral = 24;

            const ret : AttendSummary = {
                totalMajor, totalBase, totalGeneral, attendMajor, notAttendMajor,attendBase, notAttendBase,attendGeneral, notAttendGeneral, times
            }
            return(
                ret
            )
        }
        else{
            const totalMajor = 63;
            const totalBase = 9;
            const totalGeneral = 30;

            const ret : AttendSummary = {
                totalMajor, totalBase, totalGeneral, attendMajor, notAttendMajor,attendBase, notAttendBase,attendGeneral, notAttendGeneral, times
            }
            return(
                ret
            )
        }
    }
    else if(studentMajor === "심화컴퓨터"){
        if(year <= 22){
            const totalMajor = 57;
            const totalBase = 15;
            const totalGeneral = 24;

            const ret : AttendSummary = {
                totalMajor, totalBase, totalGeneral, attendMajor, notAttendMajor,attendBase, notAttendBase,attendGeneral, notAttendGeneral, times
            }
            return(
                ret
            )
        }
        else{
            const totalMajor = 60;
            const totalBase = 12;
            const totalGeneral = 30;

            const ret : AttendSummary = {
                totalMajor, totalBase, totalGeneral, attendMajor, notAttendMajor,attendBase, notAttendBase,attendGeneral, notAttendGeneral, times
            }
            return(
                ret
            )
        }
    }
    else{
        const totalMajor = 63;
        const totalBase = 9;
        const totalGeneral = 30;

        const ret : AttendSummary = {
            totalMajor, totalBase, totalGeneral, attendMajor, notAttendMajor,attendBase, notAttendBase,attendGeneral, notAttendGeneral, times
        }
        return(
            ret
        )
    }
    


    
}

export default calcCredits;
