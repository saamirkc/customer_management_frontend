import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CustomerService} from "../../../services/customer/customer.service";
import CustomerListResponse from "../../../models/customer-list-response";
import {FormBuilder} from "@angular/forms";
import {CommonService} from "../../../services/shared/common.service";
import {CustomerViewPopupComponent} from "../customer-view-popup/customer-view-popup.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {StatusType} from "../../../enums/status-type";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";
import {SuccessHandlerService} from "../../../services/successhandler/success-handler.service";
import Constants from "../../../services/shared/constants";
import {DataService} from "../../../services/shared/data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-view-customer-details',
  templateUrl: './view-customer-details.component.html',
  styleUrls: ['./view-customer-details.component.css']
})
export class ViewCustomerDetailsComponent implements OnInit {
  @ViewChild('editCustomerModalTemplate') editCustomerModalTemplate: any;
  @ViewChild('deleteModal') deleteModal?: TemplateRef<any>;
  @ViewChild('blockModal') blockModal?: TemplateRef<any>;
  @ViewChild('unblockModal') unblockModal?: TemplateRef<any>;
  private _customerDetailSubscription?: Subscription;
  private _searchTerm: string = '';
  private _customerList: CustomerListResponse[] = [];
  private _customerId?: number;
  private _selectedStatusOption?: string;

  _pageSize = 10;
  _pageNumber = 0;
  _totalPages = 0;
  _totalElements = 0;
  _pages: number[] = [];

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private successHandlerService: SuccessHandlerService, private errorHandlerService: ErrorhandlerService, private router: Router, private modalService: NgbModal, private customerService: CustomerService, private commonService: CommonService) {
  }

  search(search: string): void {
    this.getCustomerDetails(search, '');
  }

  resetSearch(searchInput: HTMLInputElement) {
    this._searchTerm = '';
    searchInput.value = '';
    this._selectedStatusOption = StatusType.PENDING;
    this.getCustomerDetails('', '');
  }

  searchByStatus(): void {
    if (this._selectedStatusOption) {
      this.getCustomerDetails(this._searchTerm, this._selectedStatusOption);
    }
  }

  openEditCustomerModal(customerId: number): void {
    this.customerService.viewCustomerById(customerId).subscribe((response) => {
      const modalRef = this.modalService.open(CustomerViewPopupComponent, {centered: true, backdrop: 'static'});
      modalRef.componentInstance._customer = response.object;
      modalRef.componentInstance._customerId = customerId;
    });
  }

  showStatusModal(customerId: number, status: string): void {
    this._customerId = customerId;
    if (status == this.deleteStatusConst) {
      this.modalService.open(this.deleteModal, {centered: true})
    } else if (status == this.activeStatusConst) {
      this.modalService.open(this.unblockModal, {centered: true})
    } else if (status == this.blockStatusConst) {
      this.modalService.open(this.blockModal, {centered: true})
    };
  }
  ngOnInit(): void {
    this.getCustomerDetails('', '');
    this.subscribeCustomerSubjectDetails();
  }

  subscribeCustomerSubjectDetails() {
    this._customerDetailSubscription = this.dataService.getCustomerDetailSubject().subscribe({
      next: customerDetails => {
        if (customerDetails) {
          const index = this.customerList.findIndex(customer => customer.id === customerDetails.id);
          this.customerList[index] = customerDetails;
        }
      }, error: err => {
        this.errorHandlerService.handleError(err)
      }
    })
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
        const modalRef = this.modalService.open(CustomerViewPopupComponent, {centered: true});
        modalRef.componentInstance._customer = value.object;
        modalRef.componentInstance._customerId = id;
        modalRef.componentInstance._viewOnly = true;
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

  updateCustomerStatus(status: StatusType) {
    if (this._customerId != null) {
      this.customerService.updateCustomerStatusById(this._customerId, status).subscribe({
        next: value => {
          this.successHandlerService.handleSuccessEvent(value.message);
          const customerIndex = this.customerList.findIndex(c => c.id === this._customerId);
          if (customerIndex !== -1) {
            this.customerList[customerIndex].status = status;
            this.customerList[customerIndex].modifiedTs = JSON.parse(value.object).modifiedTs;
          }
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
  get pendingStatus(): StatusType {
    return StatusType.PENDING;
  }
  get activeStatus(): StatusType {
    return StatusType.ACTIVE;
  }

  get inactiveStatus(): StatusType {
    return StatusType.INACTIVE;
  }

  get deletedStatus(): StatusType {
    return StatusType.DELETED;
  }

  get blockStatusConst(): string {
    return Constants.BLOCK_STATUS;
  }

  get activeStatusConst(): string {
    return Constants.ACTIVE_STATUS;
  }

  get deleteStatusConst(): string {
    return Constants.DELETE_STATUS;
  }

  get statusOptions(): StatusType[] {
    return [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DELETED];
  }

  get selectedStatusOption(): string {
    return <string>this._selectedStatusOption;
  }

  set selectedStatusOption(value: string) {
    this._selectedStatusOption = value;
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
  }
}
