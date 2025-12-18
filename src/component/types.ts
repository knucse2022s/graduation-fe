
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

// 랩실 관련 타입
export type DifficultyLevel = "초급" | "중급" | "고급";
export type TaskStatus = "진행중" | "완료" | "미시작";

export interface ExperienceTask {
  id: number;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedTime: number; // 예상 소요 시간 (시간 단위)
  prerequisites?: string[]; // 선수 지식/기술
  steps: TaskStep[]; // 단계별 가이드
  resources?: Resource[]; // 참고 자료
  reviews?: TaskReview[]; // 체험 후기
  nextSteps?: string[]; // 후속 활동 가이드
}

export interface TaskStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number; // 예상 소요 시간 (분 단위)
}

export interface Resource {
  id: number;
  title: string;
  url?: string;
  type: "문서" | "동영상" | "코드" | "논문" | "기타";
  description?: string;
}

export interface TaskReview {
  id: number;
  userId: string;
  rating: number; // 1-5점
  comment: string;
  completedDate: string;
  helpfulCount: number;
}

export interface Lab {
  id: number;
  name: string;
  professor: string;
  department: string;
  researchField: string[]; // 연구 분야
  description: string;
  experienceTasks: ExperienceTask[]; // 추천 체험 과제 목록
  requirements?: LabRequirement; // 랩실 요구사항
  contact?: LabContact; // 연락처
}

export interface LabRequirement {
  preferredSkills?: string[];
  minGpa?: number;
  prerequisites?: string[];
  other?: string;
}

export interface LabContact {
  email?: string;
  office?: string;
  website?: string;
}

// 교수진 관련 타입
export interface Faculty {
  id: number;
  name: string;
  title?: string; // 직책 (예: "정보화본부장")
  phone?: string;
  email?: string;
  imageUrl?: string; // 프로필 이미지 URL
}

export interface Course {
  id: number;
  name: string;
  code?: string; // 과목 코드
  description?: string;
  semester?: string; // 학기 정보
}

export interface Paper {
  id: number;
  title: string;
  authors?: string[];
  journal?: string;
  year?: number;
  url?: string;
  doi?: string;
}

export interface FacultyDetail {
  facultyId: number;
  courses?: Course[]; // 개설 교과목
  papers?: Paper[]; // 논문
  advice?: string; // 이 분야를 오기 위한 조언
  researchField?: string; // 연구 분야
  labIntroduction?: string; // 연구실 소개
}

// 댓글 관련 타입
export interface Comment {
  id: number;
  facultyId: number;
  content: string;
  anonymousName: string; // 익명 닉네임 (예: "익명1234")
  createdAt: string;
  likeCount: number;
  isLiked?: boolean; // 현재 사용자가 좋아요를 눌렀는지
}
