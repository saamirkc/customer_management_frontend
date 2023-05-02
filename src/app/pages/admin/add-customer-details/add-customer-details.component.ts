import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../../services/customer/customer.service";
import {CommonService} from "../../../services/shared/common.service";
import {StatusType} from "../../../enums/status-type";
import {FamilyType} from "../../../enums/family-type";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";
import {SuccessHandlerService} from "../../../services/successhandler/success-handler.service";
import {Router} from "@angular/router";
import constants from "../../../services/shared/constants";
import {FormHelpersService} from "../../../services/shared/form-helpers.service";

@Component({
  selector: 'app-add-customer-details',
  templateUrl: './add-customer-details.component.html',
  styleUrls: ['./add-customer-details.component.css']
})
export class AddCustomerDetailsComponent implements OnInit, AfterViewInit {
  private _customerDetailsForm!: FormGroup;
  @ViewChildren('selectBox') private _selectBoxes?: QueryList<ElementRef>;
  private _familyOptions = [FamilyType.FATHER, FamilyType.MOTHER, FamilyType.GRANDFATHER]

  constructor(private customerService: CustomerService, private successHandlerService: SuccessHandlerService, private router: Router,
              private errorHandlerService: ErrorhandlerService, private commonService: CommonService,
              private formHelperService: FormHelpersService, private formBuilder: FormBuilder) {
    this.initializeCustomerDetailsForm();
  }

  ngOnInit(): void {
    for (let i = 1; i < constants.UNMARRIED_CUSTOMER_FAMILY; i++)
      this.customerFamilyList.push(this.formHelperService.createFamilyMember(i, this._familyOptions))
  }

  initializeCustomerDetailsForm() {
    this._customerDetailsForm = this.formBuilder.group({
      firstName: ['', [Validators.required, this.commonService.noWhitespaceValidator]],
      lastName: ['', [Validators.required, this.commonService.noWhitespaceValidator]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      maritalStatus: ['false', Validators.required],
      userLogin: this.formBuilder.group({
        userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20),
          this.commonService.noWhitespaceValidator]]
      }),
      status: [StatusType.ACTIVE, Validators.required],
      address: ['', [Validators.required,this.commonService.noWhitespaceValidator]],
      citizenNumber: ['', [Validators.required,this.commonService.noWhitespaceValidator]],
      emailAddress: ['', [this.commonService.emailValidator, this.commonService.noWhitespaceValidator]],
      mobileNumber: ['', [Validators.required, this.commonService.mobileNumberValidator]],
      customerFamilyList: this.formBuilder.array([this.formHelperService.createFamilyMember(0, this._familyOptions)])
    })
  }

  get customerDetailsForm(): FormGroup {
    return this._customerDetailsForm;
  }

  get customerFamilyList() {
    return this._customerDetailsForm.get('customerFamilyList') as FormArray;
  }

  addFamilyMember() {
    this.customerFamilyList.push(this.formHelperService.createFamilyMember(0, this._familyOptions))
  }

  removeFamilyMember(index: number) {
    this.customerFamilyList.removeAt(index);
  }

  onMaritalStatusChange(event: any): void {
    if (event.target.value == 'true') {
      this._familyOptions.push(FamilyType.SPOUSE);
      this.customerFamilyList.push(this.formHelperService.createFamilyMember(this._familyOptions.length - 1, this._familyOptions))
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

  showHideRemoveButton(i: number): boolean {
    const maritalStatus = this.customerDetailsForm?.get('maritalStatus')?.value;
    return this.formHelperService.showHideRemoveButton(i, maritalStatus)
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

  getErrorMessage(controlName: string): string {
    const control = this.customerDetailsForm.get(controlName);
    if (control) return this.formHelperService.getErrorMessage(controlName, control);
    return '';
  }

  ngAfterViewInit(): void {
    if (this._selectBoxes) {
      this._selectBoxes.forEach(selectBox => {
        selectBox.nativeElement.disabled = true;
      });
    }
  }

  get statusOption(): StatusType {
    return StatusType.ACTIVE;
  }

  get familyOptions(): FamilyType[] {
    return this._familyOptions;
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }
}
