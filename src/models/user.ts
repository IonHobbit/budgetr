export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class User implements IUser {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}