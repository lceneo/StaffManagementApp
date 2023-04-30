import firebase from "firebase/compat/app";

export enum Gender {
  Undefined = "Не указан",
  Male = "Мужской",
  Female = "Женский"
}

export enum Promotion{
  Recent,
  Normal,
  LongAgo
}


export interface IUserFilters{
  name: string;
  salaryFrom: number;
  salaryTo: number;
  companyPosition: string;
  gender: Gender;
  projectName: string;
}

export interface IUser {
  id?: string;
  name: string;
  surname: string;
  patronic: string;
  age: number;
  gender: Gender;
  birthdayDate: Date;
  education: string;
  projectName: string;
  companyPosition: string;
  salary: number;
  interviewDate: Date;
  firstWorkDayDate: Date;
  salaryHistory: Array<{date: Date, salary: number}>;
  lastPromotion?: Promotion;
  img? : string;
}

export interface IUserFb {
  id?: string;
  name: string;
  surname: string;
  patronic: string;
  age: number;
  gender: Gender;
  birthdayDate: firebase.firestore.Timestamp;
  education: string;
  projectName: string;
  companyPosition: string;
  salary: number;
  interviewDate: firebase.firestore.Timestamp;
  firstWorkDayDate: firebase.firestore.Timestamp;
  salaryHistory: Array<{date: firebase.firestore.Timestamp, salary: number}>;
  lastPromotion?: Promotion;
}
