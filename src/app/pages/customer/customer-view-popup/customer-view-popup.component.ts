import {Component, Input, OnInit} from '@angular/core';
import {CustomerDetails} from "../../../models/customer-details";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../services/customer/customer.service";

@Component({
  selector: 'app-customer-view-popup',
  templateUrl: './customer-view-popup.component.html',
  styleUrls: ['./customer-view-popup.component.css']
})
export class CustomerViewPopupComponent implements OnInit {
  @Input() customer: CustomerDetails = {customerFamilyList: [], maritalStatus: false, status: "", userName: ""};
  constructor(public activeModal: NgbActiveModal, private customerService: CustomerService) {
  }
  onSave(): void {
    // Handle save logic here
    this.activeModal.close('Saved');
  }

  onCancel(): void {
    this.activeModal.dismiss('Cancelled');
  }
  ngOnInit(): void {
  }

}
