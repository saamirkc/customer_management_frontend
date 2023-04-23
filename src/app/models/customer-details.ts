import {FamilyType} from "../enums/family-type";

export interface CustomerDetails {
  id?: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  citizenNumber: string;
  maritalStatus: boolean;
  userName: string;
  status: string;
  address: string;
  emailAddress?: string;
  mobileNumber: string;
  customerFamilyList: CustomerFamily[]
}
interface CustomerFamily {
  id: number;
  relationship?: FamilyType;
  relationshipPersonName?: string;
}
