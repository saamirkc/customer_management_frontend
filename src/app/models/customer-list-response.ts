export default interface CustomerListResponse {
  id: number;
  userName: string;
  status: string;
  address?: string;
  emailAddress?: string;
  mobileNumber?: string;
  createdBy?: number;
  createdTs?: string;
  modifiedTs?: string;
}
