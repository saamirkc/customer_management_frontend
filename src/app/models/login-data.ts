import {LoginType} from "../enums/login-type";
export interface LoginData {
  userName: string;
  password: string;
  loginType: LoginType;
}
