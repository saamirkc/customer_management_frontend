import {Component, Input, OnInit} from '@angular/core';
import {CustomerDetails} from "../../../models/customer-details";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../services/customer/customer.service";
import {StatusType} from "../../../enums/status-type";
import {Router} from "@angular/router";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";
import {FamilyType} from "../../../enums/family-type";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../services/shared/common.service";
import {SuccessHandlerService} from "../../../services/successhandler/success-handler.service";
import {DataService} from "../../../services/shared/data.service";
import CustomerListResponse from "../../../models/customer-list-response";
import constants from "../../../services/shared/constants";
import {FormHelpersService} from "../../../services/shared/form-helpers.service";

@Component({
  selector: 'app-customer-view-popup',
  templateUrl: './customer-view-popup.component.html',
  styleUrls: ['./customer-view-popup.component.css'],
})
export class CustomerViewPopupComponent implements OnInit {
  @Input() _customerId?: number;
  @Input() _viewOnly?: boolean;
  @Input() _customer?: CustomerDetails;
  private _customerList?: CustomerListResponse;
  private _familyOptions: FamilyType[] = [];
  private _customerDetailForm?: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private successHandlerService: SuccessHandlerService,
    private commonService: CommonService,
    private activeModal: NgbActiveModal,
    private errorHandlerService: ErrorhandlerService,
    private dataService: DataService,
    private router: Router,
    private formHelperService: FormHelpersService,
    private customerService: CustomerService
  ) {
    this.initializeCustomerDefaultDetails();
    this.initializeCustomerListDefaultDetails();
  }

  // Make an API call to edit the customer with the given id
  updateCustomerDetailsById() {
    if (this.customerDetailForm.invalid) return;
    if (this._customerId != null) {
      const formData = this.customerDetailForm.value;
      this.subscribeUpdatedCustomerDetails(formData, this._customerId);
    }
  }

  subscribeUpdatedCustomerDetails(
    customerDetails: CustomerDetails,
    customerId: number) {
    this.customerService
      .updateCustomerDetail(customerDetails, customerId)
      .subscribe({
        next: (value) => {
          this.successHandlerService.handleSuccessEvent(value.message);
          this.activeModal.dismiss();
          this._customer = value.object;
          this.setCustomerList(value.object);
        },
        error: (err) => {
          this.errorHandlerService.handleError(err);
        },
      });
  }

  setCustomerList(value: CustomerListResponse) {
    if (this._customerList) {
      this._customerList.id = value.id;
      this._customerList.status = value.status;
      this._customerList.address = value.address;
      this._customerList.createdTs = value.createdTs;
      this._customerList.modifiedTs = value.modifiedTs;
      this._customerList.mobileNumber = value.mobileNumber;
      this._customerList.userName = value.userName;
      this.dataService.setCustomerDetailSubject(this._customerList);
    }
  }

  cancelUpdate() {
    this.activeModal.dismiss();
  }

  get customerFamilyList() {
    return this.customerDetailForm.get('customerFamilyList') as FormArray;
  }

  addFamilyMember() {
    this.customerFamilyList.push(this.formHelperService.createFamilyMember(0, this._familyOptions));
  }

  removeFamilyMember(index: number) {
    this.customerFamilyList.removeAt(index);
  }

  get familyOptions(): FamilyType[] {
    return this._familyOptions;
  }

  get customerDetailForm(): FormGroup {
    return <FormGroup>this._customerDetailForm;
  }

  onMaritalStatusChange(event: any): void {
    const maritalStatusControl = this.customerDetailForm.get('maritalStatus');
    if (event.target.value === 'true') {
      this.pushFamilyGroupToFamilyList();
      maritalStatusControl?.setValue(event.target.value);
    } else {
      maritalStatusControl?.setValue(event.target.value);
      this.formHelperService.removeSpouseFamilyOption(this._familyOptions, this.customerFamilyList);
    }
  }

  pushFamilyGroupToFamilyList() {
    let isFamilyGroupPushed: boolean = false;
    if (this._customer && this._customer.maritalStatus) {
      this._customer.customerFamilyList.forEach((customerFamily) => {
        if (customerFamily.relationship == FamilyType.SPOUSE) {
          const familyFormGroup = this.formBuilder.group({
            id: [customerFamily.id],
            relationship: [customerFamily.relationship, Validators.required],
            relationshipPersonName: [customerFamily.relationshipPersonName, Validators.required],
          });
          (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(familyFormGroup);
          isFamilyGroupPushed = true;
        }
      });
    }
    if (!isFamilyGroupPushed) this.customerFamilyList.push(this.formHelperService.createFamilyMember(0, this._familyOptions));
    this.familyOptions.push(FamilyType.SPOUSE);
  }

  ngOnInit(): void {
    this.initializeCustomerDetailsForm();
    this.renderCustomerFamilyTemplateDetails();
    if (this._viewOnly) this.customerDetailForm.disable();
  }

  renderCustomerFamilyTemplateDetails() {
    if (this._customer) {
      this._customer.customerFamilyList.forEach((customerFamily) => {
        const familyFormGroup = this.formBuilder.group({
          id: [customerFamily.id],
          relationship: [customerFamily.relationship, Validators.required],
          relationshipPersonName: [customerFamily.relationshipPersonName, Validators.required],
        });
        (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(familyFormGroup);
        if (customerFamily.relationship) this.familyOptions?.push(customerFamily.relationship);
      });
      // in case if the customerFamilyList is 0.
      if (this._customer.customerFamilyList.length == 0) {
        for (let i = 0; i < constants.UNMARRIED_CUSTOMER_FAMILY; i++) {
          this._familyOptions = [
            FamilyType.FATHER,
            FamilyType.MOTHER,
            FamilyType.GRANDFATHER,
          ];
          (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(
            this.formHelperService.createFamilyMember(i, this._familyOptions)
          );
        }
      }
    }
  }

  initializeCustomerDetailsForm() {
    if (this._customer) {
      this._customerDetailForm = this.formBuilder.group({
        id: [this._customerId],
        firstName: [this._customer.firstName, [Validators.required,this.commonService.noWhitespaceValidator]],
        lastName: [this._customer.lastName, [Validators.required,this.commonService.noWhitespaceValidator]],
        gender: [this._customer.gender, Validators.required],
        dateOfBirth: [this._customer.dateOfBirth, Validators.required],
        maritalStatus: [this._customer.maritalStatus, Validators.required],
        userLogin: this.formBuilder.group({
          userName: [this._customer.userName, [Validators.required, this.commonService.emailOrPhoneValidator]],
          password: [''],
        }),
        status: [this._customer.status, Validators.required],
        address: [this._customer.address, [Validators.required,this.commonService.noWhitespaceValidator]],
        citizenNumber: [this._customer.citizenNumber, [Validators.required,this.commonService.noWhitespaceValidator]],
        emailAddress: [this._customer.emailAddress, [this.commonService.emailValidator, this.commonService.noWhitespaceValidator]],
        mobileNumber: [this._customer.mobileNumber, [Validators.required, this.commonService.mobileNumberValidator]],
        customerFamilyList: this.formBuilder.array([]),
      });
    }
  }

  initializeCustomerDefaultDetails() {
    this._customer = {
      address: '',
      citizenNumber: '',
      dateOfBirth: '',
      firstName: '',
      gender: '',
      lastName: '',
      mobileNumber: '',
      customerFamilyList: [],
      maritalStatus: false,
      status: '',
      userName: '',
    };
  }

  initializeCustomerListDefaultDetails() {
    this._customerList = {
      createdBy: 0,
      createdTs: '',
      emailAddress: '',
      id: 0,
      modifiedTs: '',
      address: '',
      mobileNumber: '',
      status: StatusType.ACTIVE,
      userName: '',
    };
  }

  isRelationshipPersonNameInvalid(controlName: string, index: number): boolean {
    const relationshipPersonName = this.customerFamilyList.controls[index].get(controlName);
    if (relationshipPersonName) return this.formHelperService.isInvalidControl(relationshipPersonName);
    return false;
  }

  isInvalidControl(controlName: string): boolean {
    const control = this.customerDetailForm.get(controlName);
    if (control) return this.formHelperService.isInvalidControl(control);
    return false;
  }

  showHideRemoveButton(i: number): boolean {
    const maritalStatus = this.customerDetailForm?.get('maritalStatus')?.value;
    return this.formHelperService.showHideRemoveButton(i, maritalStatus)
  }

  get statusOptions(): StatusType[] {
    return [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DELETED];
  }

  getErrorMessage(controlName: string): string {
    const control = this.customerDetailForm.get(controlName);
    if (control) return this.formHelperService.getErrorMessage(controlName, control);
    return '';
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  get customerId(): number {
    return <number>this._customerId;
  }

  get viewOnly(): boolean {
    return <boolean>this._viewOnly;
  }

  get customer(): CustomerDetails {
    return <CustomerDetails>this._customer;
  }
}
