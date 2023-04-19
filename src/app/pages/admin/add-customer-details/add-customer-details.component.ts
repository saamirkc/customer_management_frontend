import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {CustomerService} from "../../../services/customer/customer.service";
import {CommonService} from "../../../shared/common.service";
import {StatusType} from "../../../enums/status-type";
import {FamilyType} from "../../../enums/family-type";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";

@Component({
  selector: 'app-add-customer-details',
  templateUrl: './add-customer-details.component.html',
  styleUrls: ['./add-customer-details.component.css']
})
export class AddCustomerDetailsComponent implements OnInit {
  _customerDetailsForm!: FormGroup;

  submitted = false;


  public statusOptions = [StatusType.ACTIVE]
  public familyOptions = [FamilyType.FATHER, FamilyType.MOTHER, FamilyType.GRANDFATHER]
  selectedFamilyOptions: string[] = [];

  constructor(private customerService: CustomerService, private errorHandlerService: ErrorhandlerService, private commonService: CommonService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this._customerDetailsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      maritalStatus: [false, Validators.required],
      userLogin: this.formBuilder.group({
        userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      }),
      status: ['ACTIVE', Validators.required],
      address: ['', Validators.required],
      citizenNumber: ['', Validators.required],
      emailAddress: [''],
      mobileNumber: [''],
      customerFamilyList: this.formBuilder.array([this.createFamilyMember(0)])
    })
    for (let i = 1; i < 3; i++) {
      this.customerFamilyList.push(this.createFamilyMember(i))
    }
  }

  get familyMembersList(): FormArray {
    return this._customerDetailsForm.get('customerFamilyList') as FormArray;
  }

  get customerDetailsForm(): FormGroup {
    return this._customerDetailsForm;
  }

  get customerDetailsFormControls() {
    return this._customerDetailsForm.controls;
  }

  createFamilyMember(index: number): FormGroup {
    return this.formBuilder.group({
        relationship: [this.familyOptions[index], Validators.required],
        relationshipPersonName: ['', Validators.required]
      }
    );
  }

  get customerFamilyList() {
    return this._customerDetailsForm.get('customerFamilyList') as FormArray;
  }

  addFamilyMember() {
    this.customerFamilyList.push(this.createFamilyMember(0))
  }

  removeFamilyMember(index: number) {
    this.customerFamilyList.removeAt(index);
  }

  onMaritalStatusChange(event: any): void {
    if (event.target.value === 'true') {
      this.familyOptions.push(FamilyType.SPOUSE);
      this.customerFamilyList.push(this.createFamilyMember(this.familyOptions.length-1))
    } else {
      const index = this.familyOptions.indexOf(FamilyType.SPOUSE);
      if (index > -1) {
        this.familyOptions.splice(index, 1);
      }
      while (this.customerFamilyList.length > 3) {
        this.customerFamilyList.removeAt(this.customerFamilyList.length - 1);
      }
    }
  }

  formSubmit() {
    if (this.customerDetailsForm.invalid) {
      return;
    }
    const formData = this.customerDetailsForm.value; // extract the form data
    console.log("The form data is as follows:", formData)
    this.customerService.addCustomerDetails(formData).subscribe({
        next: value => {
          console.log(value);
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(r =>
            this._customerDetailsForm.reset())
        },
        error: err => {
          this.errorHandlerService.handleError(err);
        }
      }
    )
  }
  onSelectOption(event: Event, index: number) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    this.selectedFamilyOptions[index] = selectedOption;
  }
  filteredFamilyOptions(index: number) {
    return this.familyOptions.filter(option => !this.selectedFamilyOptions.includes(option)
      || this.selectedFamilyOptions.indexOf(option) === index);
  }
}
