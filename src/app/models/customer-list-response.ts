import {StatusType} from "../enums/status-type";

export default interface CustomerListResponse {
  id: number;
  userName: string;
  status: StatusType;
  address?: string;
  emailAddress?: string;
  mobileNumber?: string;
  createdBy?: number;
  createdTs?: string;
  modifiedTs?: string;
}
