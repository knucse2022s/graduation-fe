
export type CourseStatus = "미이수" | "기이수" | "이수예정";
export type SdgsFlag = "O" | "X";
export type CourseTerm = "1-1" | "1-2" | "2-1" | "2-2" | "3-1" | "3-2" | "4-1" | "4-2" | "이수 계절" | "이수예정 계절";
export type CourseMajor = "공학전공" | "교양" | "전공기반";

export interface mustBeCourse{
    id : number; //세트 고유 아이디
    majorName : string; //전공명
    credit : number; //학점 수
    status : CourseStatus;
    major : CourseMajor;
}

export interface normalCourse{
    id : number;
    credit : number;
    status : CourseStatus;
    term : CourseTerm;
    major : CourseMajor;
}

export interface Counsel{
    id : number;
    times : number;
}

export interface AttendSummary {
  totalMajor : number
  totalBase : number;
  totalGeneral : number;
  attendMajor: number;
  notAttendMajor: number;
  attendBase: number;
  notAttendBase: number;
  attendGeneral: number;
  notAttendGeneral: number;
  times : number;
}

export interface AdditionalRequirement {
  id: number;
  check: boolean;
}

export interface AdditionalRequirements {
  English?: AdditionalRequirement;
  SDGs?: AdditionalRequirement;
  GraduationThesisAndCapstone?: AdditionalRequirement;
  [key: string]: AdditionalRequirement | undefined;
}

export type AdditionalRequirementKey =
  | "English"
  | "SDGs"
  | "GraduationThesisAndCapstone";
