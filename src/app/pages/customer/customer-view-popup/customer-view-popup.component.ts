import {Component, Input, OnInit} from '@angular/core';
import {CustomerDetails} from "../../../models/customer-details";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../services/customer/customer.service";
import Swal from "sweetalert2";
import {StatusType} from "../../../enums/status-type";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {ErrorhandlerService} from "../../../services/errorhandler/errorhandler.service";

@Component({
  selector: 'app-customer-view-popup',
  templateUrl: './customer-view-popup.component.html',
  styleUrls: ['./customer-view-popup.component.css']
})
export class CustomerViewPopupComponent implements OnInit {
  @Input() customerId?: number
  @Input() viewOnly?: boolean
  @Input() customer: CustomerDetails = {customerFamilyList: [], maritalStatus: false, status: "", userName: ""};
  public statusOptions = [StatusType.PENDING, StatusType.ACTIVE, StatusType.INACTIVE, StatusType.DISABLED, StatusType.DELETED]

  constructor(private activeModal: NgbActiveModal,private errorHandlerService: ErrorhandlerService, private router: Router, private customerService: CustomerService) {
  }

  onSave(): void {
    // Handle save logic here
    this.activeModal.close('Saved');
  }

  // Make an API call to edit the customer with the given id
  updateCustomerDetailsById() {
    if (this.customerId != null) {
      console.log(this.customer);
      this.customerService.updateCustomerDetail(this.customer, this.customerId).subscribe({
        next: value => {
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(resp => {
            this.activeModal.dismiss();
            this.customer = value.object;
          })
        }, error: err => {
        this.errorHandlerService.handleError(err);
        }
      })
    }
  }

  cancelUpdate() {
    this.activeModal.dismiss();
  }

  ngOnInit(): void {
  }

}
