import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../../services/customer/customer.service";
import {CommonService} from "../../../shared/common.service";
import {StatusType} from "../../../enums/status-type";
import {FamilyType} from "../../../enums/family-type";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";
import {ErrorsValidation} from "../../../models/errors-validation";
import {SuccessHandlerService} from "../../../services/successhandler/success-handler.service";
import {Router} from "@angular/router";
import constants from "../../../shared/constants";
import {FormHelpersService} from "../../../services/form-helpers.service";

@Component({
  selector: 'app-add-customer-details',
  templateUrl: './add-customer-details.component.html',
  styleUrls: ['./add-customer-details.component.css']
})
export class AddCustomerDetailsComponent implements OnInit, AfterViewInit {
  private _customerDetailsForm!: FormGroup;
  private _today: string = new Date().toISOString().split('T')[0];
  selectedOption: string = "";

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
  private _statusOption = StatusType.ACTIVE;
  private _familyOptions = [FamilyType.FATHER, FamilyType.MOTHER, FamilyType.GRANDFATHER]

  constructor(private customerService: CustomerService, private successHandlerService: SuccessHandlerService, private router: Router,
              private errorHandlerService: ErrorhandlerService, private commonService: CommonService,
              private formHelperService: FormHelpersService, private formBuilder: FormBuilder) {
    this.initializeCustomerDetailsForm();
  }

  ngOnInit(): void {
    for (let i = 1; i < constants.UNMARRIED_CUSTOMER_FAMILY; i++) {
      this.customerFamilyList.push(this.createFamilyMember(i))
    }
  }

  initializeCustomerDetailsForm() {
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
      status: [StatusType.ACTIVE, Validators.required],
      address: ['', Validators.required],
      citizenNumber: ['', Validators.required],
      emailAddress: ['', [this.commonService.emailValidator]],
      mobileNumber: ['', [Validators.required, this.commonService.mobileNumberValidator]],
      customerFamilyList: this.formBuilder.array([this.createFamilyMember(0)])
    })
  }

  get customerDetailsForm(): FormGroup {
    return this._customerDetailsForm;
  }

  createFamilyMember(index: number): FormGroup {
    return this.formBuilder.group({
        relationship: [this._familyOptions[index], Validators.required],
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
    if (event.target.value == 'true') {
      this._familyOptions.push(FamilyType.SPOUSE);
      this.customerFamilyList.push(this.createFamilyMember(this._familyOptions.length - 1))
    } else {
      this.formHelperService.removeSpouseFamilyOption(this._familyOptions, this.customerFamilyList);
    }
  }

  formSubmit() {
    if (this.customerDetailsForm.invalid) return;

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

  isInvalidControl(controlName: string): boolean {
    const control = this.customerDetailsForm.get(controlName);
    if (control) return this.formHelperService.isInvalidControl(control);
    return false;
  }

  isRelationshipPersonNameInvalid(controlName: string, index: number) {
    const relationshipPersonName = this.customerFamilyList.controls[index].get(controlName);
    if (relationshipPersonName) return this.formHelperService.isInvalidControl(relationshipPersonName);
    return false;
  }

  shouldShowRemoveButton(i: number): boolean {
    const maritalStatus = this.customerDetailsForm?.get('maritalStatus')?.value;
    return (maritalStatus == 'true' && i > 3) || (maritalStatus == 'false' && i > 2);
  }

  createFamilyMemberForMarriedCustomer(index: number): FormGroup {
    if (this._customerDetailsForm) {
      const maritalStatusControl = this._customerDetailsForm.get('maritalStatus');
      const isMarried = maritalStatusControl?.value;
      if (isMarried) {
        const relationshipControl = this.formBuilder.control({
          value: this._familyOptions[index],
          disabled: true,
        });
        return this.formBuilder.group({
          relationship: relationshipControl,
          relationshipPersonName: ['', Validators.required]
        });
      }
    }
    return this.formBuilder.group({
      relationship: [this._familyOptions[index], Validators.required],
      relationshipPersonName: ['', Validators.required]
    });
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

  get statusOption(): StatusType {
    return this._statusOption;
  }

  get familyOptions(): FamilyType[] {
    return this._familyOptions;
  }

  get today(): string {
    return this._today;
  }
}
