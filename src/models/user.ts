import { Timestamp } from "firebase/firestore";

export enum UserRole {
  CUSTODIAN = 'custodian'
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  timestamp: Timestamp;
}

export class User implements IUser {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public role?: UserRole;
  public timestamp: Timestamp;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.timestamp = user.timestamp;
  }
}