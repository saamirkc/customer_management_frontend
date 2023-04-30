import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FamilyType} from "../../enums/family-type";
import constants from "./constants";

@Injectable({
  providedIn: 'root'
})
export class FormHelpersService {
  constructor(private formBuilder: FormBuilder) {}

  isInvalidControl(control: AbstractControl): boolean {
    return control?.invalid && (control?.dirty || control?.touched);
  }

  removeSpouseFamilyOption(familyOptions: FamilyType[], customerFamilyList: FormArray) {
    const index = familyOptions.indexOf(FamilyType.SPOUSE);
    // to slice the last option
    if (index > -1) familyOptions.splice(index, 1);

    // to remove the customer family list last form array.
    while (customerFamilyList.length > constants.UNMARRIED_CUSTOMER_FAMILY) {
      customerFamilyList.removeAt(customerFamilyList.length - 1);
    }
  }
  createFamilyMember(index: number, familyOptions: FamilyType[]): FormGroup {
    return this.formBuilder.group({
        relationship: [familyOptions[index], Validators.required],
        relationshipPersonName: ['', Validators.required]
      }
    );
  }
  showHideRemoveButton(i: number, maritalStatus: boolean | string): boolean {
    return (
      ((maritalStatus == true || maritalStatus == 'true') && i > constants.UNMARRIED_CUSTOMER_FAMILY) ||
      ((maritalStatus == false || maritalStatus == 'false') && i > constants.UNMARRIED_CUSTOMER_FAMILY-1)
    );
  }
}
