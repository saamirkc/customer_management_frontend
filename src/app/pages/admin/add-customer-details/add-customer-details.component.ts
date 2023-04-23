import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../../services/customer/customer.service";
import {CommonService} from "../../../shared/common.service";
import {StatusType} from "../../../enums/status-type";
import {FamilyType} from "../../../enums/family-type";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";
import {ErrorsValidation} from "../../../models/errors-validation";
import {SuccessHandlerService} from "../../../services/successhandler/success-handler.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-customer-details',
  templateUrl: './add-customer-details.component.html',
  styleUrls: ['./add-customer-details.component.css']
})
export class AddCustomerDetailsComponent implements OnInit, AfterViewInit {
  _customerDetailsForm!: FormGroup;

  submitted = false;
  disabled = true;
  today: string = new Date().toISOString().split('T')[0];
  private _userNameErrors: ErrorsValidation = {
    required: 'Username is required',
    invalid: 'Please enter a valid email or phone number'
  };
  private _passwordErrors: ErrorsValidation = {
    required: 'Password is required',
    invalid: 'Password length must be minimum 6'
  };
  private _mobileNumberErrors: ErrorsValidation = {
    required: 'Mobile Number is required',
    invalid: 'Please enter a valid mobile number '
  };
  private _emailErrors: ErrorsValidation = {
    required: '',
    invalid: 'Please enter a valid email'
  };
  @ViewChildren('selectBox') selectBoxes?: QueryList<ElementRef>;

  public statusOptions = [StatusType.ACTIVE]
  public familyOptions = [FamilyType.FATHER, FamilyType.MOTHER, FamilyType.GRANDFATHER]
  selectedFamilyOptions: string[] = [];

  constructor(private customerService: CustomerService, private successHandlerService: SuccessHandlerService, private router: Router,
              private errorHandlerService: ErrorhandlerService, private commonService: CommonService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this._customerDetailsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      maritalStatus: ['false', Validators.required],
      userLogin: this.formBuilder.group({
        userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      }),
      status: ['ACTIVE', Validators.required],
      address: ['', Validators.required],
      citizenNumber: ['', Validators.required],
      emailAddress: ['', [this.commonService.emailValidator]],
      mobileNumber: ['', [Validators.required, this.commonService.mobileNumberValidator]],
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

  createFamilyMemberForMarriedCustomer(index: number): FormGroup {
    if (this._customerDetailsForm) {
      const maritalStatusControl = this._customerDetailsForm.get('maritalStatus');
      const isMarried = maritalStatusControl?.value;
      if (isMarried) {
        const relationshipControl = this.formBuilder.control({
          value: this.familyOptions[index],
          disabled: false
        });
        return this.formBuilder.group({
          relationship: relationshipControl,
          relationshipPersonName: ['', Validators.required]
        });
      }
    }
    return this.formBuilder.group({
      relationship: [this.familyOptions[index], Validators.required],
      relationshipPersonName: ['', Validators.required]
    });
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
      this.customerFamilyList.push(this.createFamilyMemberForMarriedCustomer(this.familyOptions.length - 1))
    } else {
      const index = this.familyOptions.indexOf(FamilyType.SPOUSE);
      if (index > -1) {
        this.familyOptions.splice(index, 1);
      }
      while (this.customerFamilyList.length > 3) {
        this.customerFamilyList.removeAt(this.customerFamilyList.length - 1);
      }
    }
    // this.disableSelectBoxes();
  }

  formSubmit() {
    if (this.customerDetailsForm.invalid) {
      return;
    }
    const formData = this.customerDetailsForm.value; // extract the form data
    this.customerService.addCustomerDetails(formData).subscribe({
        next: value => {
          this.successHandlerService.handleSuccessEvent(value.message);
          this._customerDetailsForm.reset();
          this.router.navigate(['/admin-dashboard/customer-details']);
        },
        error: err => {
          this.errorHandlerService.handleError(err);
        }
      }
    )
  }

  public disableSelect(memberIndex: number): boolean {
    return memberIndex < 3;
  }

  onSelectOption(event: Event, index: number) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    this.selectedFamilyOptions[index] = selectedOption;
  }

  filteredFamilyOptions(index: number) {
    return this.familyOptions.filter(option => !this.selectedFamilyOptions.includes(option)
      || this.selectedFamilyOptions.indexOf(option) === index);
  }

  get userNameErrors(): ErrorsValidation {
    return this._userNameErrors;
  }

  get passwordErrors(): ErrorsValidation {
    return this._passwordErrors;
  }

  get mobileNumberErrors(): ErrorsValidation {
    return this._mobileNumberErrors;
  }

  get emailErrors(): ErrorsValidation {
    return this._emailErrors;
  }

  ngAfterViewInit(): void {
    if (this.selectBoxes) {
      this.selectBoxes.forEach(selectBox => {
        selectBox.nativeElement.disabled = true;
      });
    }
  }
}
