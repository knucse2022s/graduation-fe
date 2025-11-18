import type {normalCourse, mustBeCourse, Counsel, AttendSummary} from "./types";

export function calcCredits(mustBe: mustBeCourse[], normal : normalCourse[], counsel : Counsel, studentid : number, studentMajor : string){
    const attendMust1 = mustBe.filter(c => c.status === "기이수" && c.major === "공학전공");
    const notAttendMust1 = mustBe.filter(c => c.status === "이수예정" && c.major === "공학전공");
    const attendMust2 = mustBe.filter(c => c.status === "기이수" && c.major === "전공기반");
    const notAttendMust2 = mustBe.filter(c => c.status === "이수예정" && c.major === "전공기반");
    const attendMust3 = mustBe.filter(c => c.status === "기이수" && c.major === "교양");
    const notAttendMust3 = mustBe.filter(c => c.status === "이수예정" && c.major === "교양");

    const attendnormal1 = mustBe.filter(c => c.status === "기이수" && c.major === "공학전공");
    const notAttendnormal1 = mustBe.filter(c => c.status === "이수예정" && c.major === "공학전공");
    const attendnormal2 = mustBe.filter(c => c.status === "기이수" && c.major === "전공기반");
    const notAttendnormal2 = mustBe.filter(c => c.status === "이수예정" && c.major === "전공기반");
    const attendnormal3 = mustBe.filter(c => c.status === "기이수" && c.major === "교양");
    const notAttendnormal3 = mustBe.filter(c => c.status === "이수예정" && c.major === "교양");

    const sum = (arr: Array<{credit : number}>) => (arr.reduce((acc, cur) => acc + cur.credit, 0));

    const attendMajor  = sum(attendMust1) + sum(attendnormal1);
    const attendBase  = sum(attendMust2) + sum(attendnormal2);
    const attendGeneral  = sum(attendMust3) + sum(attendnormal3);
    const notAttendMajor  = sum(notAttendMust1) + sum(notAttendnormal1);
    const notAttendBase  = sum(notAttendMust2) + sum(notAttendnormal2);
    const notAttendGeneral  = sum(notAttendMust3) + sum(notAttendnormal3);
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