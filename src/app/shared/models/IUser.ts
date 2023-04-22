export enum Gender {
  Undefined = "Не указан",
  Male = "Мужской",
  Female = "Женский"
}

export interface IUserFilters{
  name: string;
  salary: {
    from: number,
    to: number
  };
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
  salaryHistory: number[];
}
