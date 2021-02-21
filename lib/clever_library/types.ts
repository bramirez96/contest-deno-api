export interface ICleverSection {
  id: string;
  teacher: string;
  teachers: string[];
  name: string;
  subject: CleverSubjectType;
  students: string[];
  grade: CleverGradeType;
}

export interface ICleverTeacher {
  id: string;
  email?: string;
  name: { first: string; last: string; middle?: string };
  sections: string[];
}

export interface ICleverStudent {
  id: string;
  email?: string;
  name: { first: string; last: string; middle?: string };
  grade: CleverGradeType;
}

export type CleverSubjectType =
  | 'english/language arts'
  | 'math'
  | 'science'
  | 'social studies'
  | 'language'
  | 'homeroom/advisory'
  | 'interventions/online learning'
  | 'technology and engineering'
  | 'PE and health'
  | 'arts and music'
  | 'other'
  | '';

export type CleverGradeType =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | 'PreKindergarten'
  | 'TransitionalKindergarten'
  | 'Kindergarten'
  | 'InfantToddler'
  | 'Preschool'
  | 'PostGraduate'
  | 'Ungraded'
  | 'Other'
  | '';

export interface ICleverConfig {
  clientId: string;
  clientSecret: string;
  redirectURI: string;
  apiVersion?: string;
}
