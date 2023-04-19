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

@Component({
  selector: 'app-customer-view-popup',
  templateUrl: './customer-view-popup.component.html',
  styleUrls: ['./customer-view-popup.component.css']
})
export class CustomerViewPopupComponent implements OnInit {
  @Input() customerId?: number
  @Input() viewOnly?: boolean
  @Input() customer: CustomerDetails = {customerFamilyList: [], maritalStatus: false, status: "", userName: ""};
  private _statusOptions = [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DELETED]
  private _familyOptions: FamilyType[] = [];
  private _customerDetailForm?: FormGroup;

  constructor(private formBuilder: FormBuilder, private successHandlerService: SuccessHandlerService, private commonService: CommonService, private activeModal: NgbActiveModal, private errorHandlerService: ErrorhandlerService, private router: Router, private customerService: CustomerService) {
  }

  onSave(): void {
    // Handle save logic here
    this.activeModal.close('Saved');
  }

  // Make an API call to edit the customer with the given id
  updateCustomerDetailsById() {
    if (this.customerDetailForm.invalid) {
      return;
    }
    if (this.customerId != null) {
      const formData = this.customerDetailForm.value;
      this.customerService.updateCustomerDetail(formData, this.customerId).subscribe({
        next: value => {
          this.successHandlerService.handleSuccessEvent(value.message)
          this.activeModal.dismiss();
          this.customer = value.object;
          window.location.reload();
        }, error: err => {
          this.errorHandlerService.handleError(err);
        }
      })
    }
  }

  cancelUpdate() {
    this.activeModal.dismiss();
  }

  get customerFamilyList() {
    return this.customerDetailForm.get('customerFamilyList') as FormArray;
  }

  createFamilyMember(): FormGroup {
    return this.formBuilder.group({
        relationship: [FamilyType.FATHER, Validators.required],
        relationshipPersonName: ['', Validators.required]
      }
    );
  }

  addFamilyMember() {
    this.customerFamilyList.push(this.createFamilyMember())
  }

  removeFamilyMember(index: number) {
    this.customerFamilyList.removeAt(index);
  }

  get familyOptions(): FamilyType[] {
    return this._familyOptions;
  }

  get customerDetailForm(): FormGroup {
    return <FormGroup<any>>this._customerDetailForm;
  }

  onMaritalStatusChange(event: any): void {
    if (event.target.value === 'true') {
      this.customerDetailForm.patchValue({maritalStatus: true});
      this.customerFamilyList.push(this.createFamilyMember())
      this.familyOptions.push(FamilyType.SPOUSE);
    } else {
      this.customerDetailForm.patchValue({maritalStatus: false});
      const index = this.familyOptions.indexOf(FamilyType.SPOUSE);
      if (index > -1) {
        this.familyOptions.splice(index, 1);
      }
      while (this.customerFamilyList.length > 3) {
        this.customerFamilyList.removeAt(this.customerFamilyList.length - 1);
      }
    }
  }

  ngOnInit(): void {
    this._customerDetailForm = this.formBuilder.group({
      id:[this.customerId],
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
      emailAddress: this.customer.emailAddress,
      mobileNumber: [this.customer.mobileNumber, Validators.required],
      customerFamilyList: this.formBuilder.array([])
    })

    this.customer.customerFamilyList.forEach((customerFamily) => {
      const familyFormGroup = this.formBuilder.group({
        id:[customerFamily.id],
        relationship: [customerFamily.relationship, Validators.required],
        relationshipPersonName: [customerFamily.relationshipPersonName, Validators.required]
      });
      (<FormArray>this.customerDetailForm.get('customerFamilyList')).push(familyFormGroup);
      if (customerFamily.relationship) {
        this.familyOptions?.push(customerFamily.relationship);
      }
    });
    if (this.viewOnly) {
      this.customerDetailForm.disable();
    }
  }

  get statusOptions(): StatusType[] {
    return this._statusOptions;
  }
}
