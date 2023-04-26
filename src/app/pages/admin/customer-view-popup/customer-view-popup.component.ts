import {Component, Input, OnInit} from '@angular/core';
import {CustomerDetails} from "../../../models/customer-details";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../services/customer/customer.service";
import {StatusType} from "../../../enums/status-type";
import {Router} from "@angular/router";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";
import {FamilyType} from "../../../enums/family-type";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../shared/common.service";
import {SuccessHandlerService} from "../../../services/successhandler/success-handler.service";
import {ErrorsValidation} from "../../../models/errors-validation";
import {DataService} from "../../../services/data.service";
import CustomerListResponse from "../../../models/customer-list-response";
import constants from "../../../shared/constants";

@Component({
  selector: 'app-customer-view-popup',
  templateUrl: './customer-view-popup.component.html',
  styleUrls: ['./customer-view-popup.component.css']
})
export class CustomerViewPopupComponent implements OnInit {
  @Input() customerId?: number
  @Input() viewOnly?: boolean
  @Input() customer: CustomerDetails = {
    address: "",
    citizenNumber: "",
    dateOfBirth: "",
    firstName: "",
    gender: "",
    lastName: "",
    mobileNumber: "",
    customerFamilyList: [], maritalStatus: false, status: "", userName: ""
  };
  private _customerList: CustomerListResponse = {
    createdBy: 0, createdTs: "",
    emailAddress: "", id: 0, modifiedTs: "",
    address: "",
    mobileNumber: "",
    status: StatusType.ACTIVE, userName: ""
  };
  private _statusOptions = [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DELETED]
  private _familyOptions: FamilyType[] = [];
  private _customerDetailForm?: FormGroup;
  private _today: string = new Date().toISOString().split('T')[0];

  private _userNameErrors: ErrorsValidation = {
    required: 'Username is required',
    invalid: 'Please enter a valid email or phone number'
  };
  private _mobileNumberErrors: ErrorsValidation = {
    required: 'Mobile Number is required',
    invalid: 'Please enter a valid mobile number'
  };
  private _emailErrors: ErrorsValidation = {
    required: '',
    invalid: 'Please enter a valid email'
  };

  constructor(private formBuilder: FormBuilder, private successHandlerService: SuccessHandlerService,
              private commonService: CommonService, private activeModal: NgbActiveModal,
              private errorHandlerService: ErrorhandlerService, private dataService: DataService,
              private router: Router, private customerService: CustomerService) {
  }

  // Make an API call to edit the customer with the given id
  updateCustomerDetailsById() {
    if (this.customerDetailForm.invalid) return;
    if (this.customerId != null) {
      const formData = this.customerDetailForm.value;
      this.subscribeUpdatedCustomerDetails(formData, this.customerId);
    }
  }

  subscribeUpdatedCustomerDetails(customerDetails: CustomerDetails, customerId: number) {
    this.customerService.updateCustomerDetail(customerDetails, customerId).subscribe({
      next: value => {
        this.successHandlerService.handleSuccessEvent(value.message)
        this.activeModal.dismiss();
        this.customer = value.object;
        this.setCustomerList(value.object);
      }, error: err => {
        this.errorHandlerService.handleError(err);
      }
    })
  }

  setCustomerList(value: CustomerListResponse) {
    this._customerList.id = value.id;
    this._customerList.status = value.status;
    this._customerList.address = value.address;
    this._customerList.createdTs = value.createdTs;
    this._customerList.modifiedTs = value.modifiedTs;
    this._customerList.mobileNumber = value.mobileNumber;
    this._customerList.userName = value.userName;
    this.dataService.setCustomerDetailSubject(this._customerList);
  }

  cancelUpdate() {
    this.activeModal.dismiss();
  }

  get customerFamilyList() {
    return this.customerDetailForm.get('customerFamilyList') as FormArray;
  }

  createFamilyMember(index: number): FormGroup {
    return this.formBuilder.group({
        relationship: [this.familyOptions[index], Validators.required],
        relationshipPersonName: ['', Validators.required]
      }
    );
  }

  addFamilyMember() {
    this.customerFamilyList.push(this.createFamilyMember(0))
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
    let isFamilyGroupPushed: boolean = false;
    const maritalStatusControl = this.customerDetailForm.get('maritalStatus');
    if (event.target.value === 'true') {
      if (this.customer.maritalStatus) {
        this.customer.customerFamilyList.forEach((customerFamily) => {
          const familyFormGroup = this.formBuilder.group({
            id: [customerFamily.id],
            relationship: [customerFamily.relationship, Validators.required],
            relationshipPersonName: [customerFamily.relationshipPersonName, Validators.required]
          });
          if (customerFamily.relationship == FamilyType.SPOUSE) {
            (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(familyFormGroup);
            isFamilyGroupPushed = true;
          }
        })
      }
      maritalStatusControl?.setValue(event.target.value);
      if (!isFamilyGroupPushed) this.customerFamilyList.push(this.createFamilyMember(0))
      this.familyOptions.push(FamilyType.SPOUSE);
    } else {
      maritalStatusControl?.setValue(event.target.value);
      const index = this.familyOptions.indexOf(FamilyType.SPOUSE);
      if (index > -1) {
        this.familyOptions.splice(index, 1);
      }
      while (this.customerFamilyList.length > constants.UNMARRIED_CUSTOMER_FAMILY) {
        this.customerFamilyList.removeAt(this.customerFamilyList.length - 1);
      }
    }
  }

  ngOnInit(): void {
    this.initializeCustomerDetailsForm();
    this.renderCustomerFamilyTemplateDetails()
    if (this.viewOnly) this.customerDetailForm.disable();
  }

  renderCustomerFamilyTemplateDetails() {
    this.customer.customerFamilyList.forEach((customerFamily) => {
      const familyFormGroup = this.formBuilder.group({
        id: [customerFamily.id],
        relationship: [customerFamily.relationship, Validators.required],
        relationshipPersonName: [customerFamily.relationshipPersonName, Validators.required]
      });
      (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(familyFormGroup);
      if (customerFamily.relationship) this.familyOptions?.push(customerFamily.relationship);
    });
    // in case if the customerFamilyList is 0.
    if (this.customer.customerFamilyList.length == 0) {
      for (let i = 0; i < constants.UNMARRIED_CUSTOMER_FAMILY; i++) {
        this._familyOptions = [FamilyType.FATHER, FamilyType.MOTHER, FamilyType.GRANDFATHER];
        (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(this.createFamilyMember(i));
      }
    }
  }

  initializeCustomerDetailsForm() {
    this._customerDetailForm = this.formBuilder.group({
      id: [this.customerId],
      firstName: [this.customer.firstName, Validators.required],
      lastName: [this.customer.lastName, Validators.required],
      gender: [this.customer.gender, Validators.required],
      dateOfBirth: [this.customer.dateOfBirth, Validators.required],
      maritalStatus: [this.customer.maritalStatus, Validators.required],
      userLogin: this.formBuilder.group({
        userName: [this.customer.userName, [Validators.required, this.commonService.emailOrPhoneValidator]],
        password: [''],
      }),
      status: [this.customer.status, Validators.required],
      address: [this.customer.address, Validators.required],
      citizenNumber: [this.customer.citizenNumber, Validators.required],
      emailAddress: [this.customer.emailAddress, [this.commonService.emailValidator]],
      mobileNumber: [this.customer.mobileNumber, [Validators.required, this.commonService.mobileNumberValidator]],
      customerFamilyList: this.formBuilder.array([])
    })
  }

  get statusOptions(): StatusType[] {
    return this._statusOptions;
  }

  get userNameErrors(): ErrorsValidation {
    return this._userNameErrors;
  }

  get mobileNumberErrors(): ErrorsValidation {
    return this._mobileNumberErrors;
  }

  get emailErrors(): ErrorsValidation {
    return this._emailErrors;
  }

  get today(): string {
    return this._today;
  }
}
