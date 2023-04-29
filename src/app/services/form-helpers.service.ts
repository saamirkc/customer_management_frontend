import {Injectable} from '@angular/core';
import {AbstractControl, FormArray} from "@angular/forms";
import {FamilyType} from "../enums/family-type";
import constants from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class FormHelpersService {
  constructor() {
  }

  isInvalidControl(control: AbstractControl): boolean {
    return control?.invalid && (control?.dirty || control?.touched);
  }

  removeSpouseFamilyOption(familyOptions: FamilyType[], customerFamilyList: FormArray) {
    const index = familyOptions.indexOf(FamilyType.SPOUSE);
    // to slice the last option
    if (index > -1) {
      familyOptions.splice(index, 1);
    }
    // to remove the customer family list last form array.
    while (customerFamilyList.length > constants.UNMARRIED_CUSTOMER_FAMILY) {
      customerFamilyList.removeAt(customerFamilyList.length - 1);
    }
  }

}
