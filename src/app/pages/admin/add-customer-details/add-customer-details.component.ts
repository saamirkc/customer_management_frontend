import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {CustomerService} from "../../../services/customer/customer.service";
import {CommonService} from "../../../shared/common.service";
import {StatusType} from "../../../enums/status-type";
import {FamilyType} from "../../../enums/family-type";

@Component({
  selector: 'app-add-customer-details',
  templateUrl: './add-customer-details.component.html',
  styleUrls: ['./add-customer-details.component.css']
})
export class AddCustomerDetailsComponent implements OnInit {
  private readonly _customerDetailsForm: FormGroup;

  public statusOptions = [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DISABLED, StatusType.DELETED]
  public familyOptions = [FamilyType.FATHER, FamilyType.MOTHER, FamilyType.SON, FamilyType.DAUGHTER]

  constructor(private customerService: CustomerService, private commonService: CommonService, private formBuilder: FormBuilder) {
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
      customerFamilyList: this.formBuilder.array([this.createFamilyMember()])
    })
  }

  ngOnInit(): void {
  }

  get familyMembersList(): FormArray {
    return this._customerDetailsForm.get('customerFamilyList') as FormArray;
  }

  get customerDetailsForm(): FormGroup {
    return this._customerDetailsForm;
  }

  createFamilyMember(): FormGroup {
    return this.formBuilder.group({
      relationship: ['SON', Validators.required],
      relationshipPersonName: ['', Validators.required]
    });
  }

  get customerFamilyList() {
    return this._customerDetailsForm.get('customerFamilyList') as FormArray;
  }

  addFamilyMember() {
    this.customerFamilyList.push(this.createFamilyMember())
  }
  removeFamilyMember(index: number) {
    this.customerFamilyList.removeAt(index);
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
          console.error(err)
          if (err.error.details.length != 0) {
            Swal.fire({
              title: err.error.details[0],
              icon: 'error',
              timer: 3000
            });
          } else {
            Swal.fire({
              title: err.error.message,
              icon: 'error',
              timer: 3000
            });
          }
        }
      }
    )
  }
}
