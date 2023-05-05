import firebase from "firebase/compat/app";

export enum Gender {
  Undefined = "Любой",
  Male = "Мужской",
  Female = "Женский"
}

export enum CompanyPosition{
  Undefined = "Любая",
  Developer = "Разработчик",
  Tester = "Тестировщик",
  DevOps = "DevOps инженер",
  HR = "Менеджер по подбору персонала",
  SystemAdministrator = "Системный администратор",
  Designer = "Дизайнер"
}

export enum Promotion{
  Successful = "Успешный",
  Normal = "Обычный",
  Unsuccessful = "Неуспешный"
}


export interface IUserFilters{
  name: string;
  salaryFrom: number;
  salaryTo: number;
  companyPosition: CompanyPosition;
  gender: Gender;
  projectName: string;
  fired: boolean;
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
  companyPosition: CompanyPosition;
  salary: number;
  interviewDate: Date;
  firstWorkDayDate: Date;
  salaryHistory: Array<{date: Date, salary: number}>;
  lastPromotion?: Promotion;
  img? : string;
  fired: boolean;
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
