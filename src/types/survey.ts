export type PlayStyle = 'casual' | 'competitive';
export type ReferralSource = 'referred' | 'media';

export interface SurveyAnswers {
  name: string;
  birthDate: string; // YYYY-MM-DD or readable
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  phone: string;
  ign: string;
  uid: string;
  playStyle: PlayStyle | null;
  referralSource: ReferralSource | null;
  refereeName: string;
  mediaDetails: string;
}

export type SurveyStep = 
  | 'intro'
  | 'q1_name'
  | 'q2_birthdate'
  | 'q3_phone'
  | 'q4_ign'
  | 'q5_uid'
  | 'q6_playstyle'
  | 'q7_source'
  | 'q8_detail'
  | 'outro';

export type AssistantMood = 
  | 'waving' 
  | 'curious' 
  | 'happy' 
  | 'note' 
  | 'gaming' 
  | 'inspecting' 
  | 'thoughtful' 
  | 'impressed' 
  | 'celebrating';

export interface MemberLogPayload {
  dateJoined: string;
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  ign: string;
  uid: string;
  playstyle: string;
  survey1: string;
  survey2: string;
}
