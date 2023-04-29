export enum Gender {
  Undefined = "Не указан",
  Male = "Мужской",
  Female = "Женский"
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
}
