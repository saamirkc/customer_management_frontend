import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CustomerService} from "../../../services/customer/customer.service";
import CustomerListResponse from "../../../models/customer-list-response";
import {CustomerDetails} from "../../../models/customer-details";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../shared/common.service";
import {CustomerViewPopupComponent} from "../../customer/customer-view-popup/customer-view-popup.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {StatusType} from "../../../enums/status-type";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";

@Component({
  selector: 'app-view-customer-details',
  templateUrl: './view-customer-details.component.html',
  styleUrls: ['./view-customer-details.component.css']
})
export class ViewCustomerDetailsComponent implements OnInit {
  @ViewChild('editCustomerModalTemplate') editCustomerModalTemplate: any;

  @ViewChild('deleteModal') deleteModal?: TemplateRef<any>;

  _searchTerm: string = '';
  public statusOptions = [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DISABLED, StatusType.DELETED]
  private _customerList: CustomerListResponse[] = [];
  private _customerDetail: CustomerDetails;
  private readonly _customerDetailForm: FormGroup;
  private _customerId?: number;

  _selectedStatusOption?: string;

  _pageSize = 10;
  _pageNumber = 0;
  _totalPages = 0;
  _totalElements = 0;
  _pages: number[] = [];

  constructor(private formBuilder: FormBuilder, private errorHandlerService: ErrorhandlerService, private router: Router, private modalService: NgbModal, private customerService: CustomerService, private commonService: CommonService) {
    this._customerDetail = {customerFamilyList: [], maritalStatus: false, status: "", userName: ""};
    this._customerDetailForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }


  search(): void {
    this.getCustomerDetails(this._searchTerm, '');
  }

  searchByStatus(): void {
    if (this._selectedStatusOption) {
      this.getCustomerDetails(this._searchTerm, this._selectedStatusOption);
    }
  }

  openEditCustomerModal(customerId: number): void {
    this.customerService.viewCustomerById(customerId).subscribe((response) => {
      const modalRef = this.modalService.open(CustomerViewPopupComponent, {centered: true, backdrop: 'static'});
      modalRef.componentInstance.customer = response.object;
      modalRef.componentInstance.customerId = customerId;
    });
  }

  showDeleteModal(customerId: number): void {
    this.modalService.open(this.deleteModal, {centered: true});
    this._customerId = customerId;
  }

  ngOnInit(): void {
    this.getCustomerDetails('', '');
  }

  getCustomerDetails(search: string, status: string) {
    this.customerService.getCustomerList(this._pageNumber, this._pageSize, status, search, 'createdTs', 'desc')
      .subscribe({
        next: value => {
          this._customerList = value.object.content;
          this._totalPages = value.object.totalPages;
          this._totalElements = value.object._totalElements;
          this._pages = Array.from(Array(this._totalPages).keys());
        }, error: err => {
          this.errorHandlerService.handleError(err);
        }
      })
  }

  goToPage(page: number) {
    if (page >= 0 && page < this._totalPages) {
      this._pageNumber = page;
      this.getCustomerDetails('', '');
    }
  }

  // Make an API call to view the customer with the given id
  viewCustomerById(id: number) {
    this.customerService.viewCustomerById(id).subscribe({
      next: value => {
        // this._customerDetail = value.object;
        // console.log(this._customerDetail);
        const modalRef = this.modalService.open(CustomerViewPopupComponent, {centered: true});
        modalRef.componentInstance.customer = value.object;
        modalRef.componentInstance.customerId = id;
        modalRef.componentInstance.viewOnly = true;
        // popup or redirect to another uri.
      }, error: err => {
        this.errorHandlerService.handleError(err);
      }
    })
  }

  // Make an API call to delete the customer with the given id
  public decline() {
    this.modalService.dismissAll();
  }

  trackByFn(index: number, customer: any): number {
    return customer.id; // use customer id as trackBy value
  }

  deleteCustomer() {
    if (this._customerId != null) {
      this.customerService.deleteCustomerById(this._customerId).subscribe({
        next: value => {
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(r => {
            const deletedCustomerIndex = this.customerList.findIndex(c => c.id === this._customerId);
            if (deletedCustomerIndex !== -1) {
              this.customerList[deletedCustomerIndex].status = StatusType.DELETED;
            }
          })
          // popup or redirect to another uri.
        }, error: err => {
          this.errorHandlerService.handleError(err);
        }
      })
    }
    this.modalService.dismissAll();
  }

  get customerList(): CustomerListResponse[] {
    return this._customerList;
  }

  get customerDetail(): CustomerDetails {
    return this._customerDetail;
  }

}
