import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CustomerService} from "../../../services/customer/customer.service";
import CustomerListResponse from "../../../models/customer-list-response";
import {CustomerDetails} from "../../../models/customer-details";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../shared/common.service";
import {CustomerViewPopupComponent} from "../../customer/customer-view-popup/customer-view-popup.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-view-customer-details',
  templateUrl: './view-customer-details.component.html',
  styleUrls: ['./view-customer-details.component.css']
})
export class ViewCustomerDetailsComponent implements OnInit {
  @ViewChild('editCustomerModalTemplate') editCustomerModalTemplate: any;

  private _customerList: CustomerListResponse[] = [];
  private _customerDetail: CustomerDetails = {customerFamilyList: [], maritalStatus: false, status: "", userName: ""};
  private readonly _customerDetailForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private customerService: CustomerService, private commonService: CommonService) {
    this._customerDetailForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  openEditCustomerModal(customerId: number): void {
    this.customerService.viewCustomerById(customerId).subscribe((response) => {
      const modalRef = this.modalService.open(CustomerViewPopupComponent, { centered: true });
      modalRef.componentInstance.customer = response.object;
      modalRef.result.then((result) => {
        // Handle any actions needed after the modal closes, if necessary
      }, (reason) => {
        // Handle any actions needed if the modal is dismissed or closed for some other reason
      });
    });

  }

  ngOnInit(): void {
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    this.customerService.getCustomerList(0, 10, '', 'createdTs', 'desc')
      .subscribe({
        next: value => {
          this._customerList = value.object.content;
        }, error: err => {
          console.error(err)
          if (err.error.details.length != 0) {
            Swal.fire({
              title: err.error.details[0],
              icon: 'error',
              timer: 3000
            });
          } else {
            Swal.fire({
              title: err.error.message,
              icon: 'error',
              timer: 3000
            });
          }
        }
      })
  }

  // Make an API call to view the customer with the given id
  viewCustomerById(id: number) {
    this.customerService.viewCustomerById(id).subscribe({
      next: value => {
        this._customerDetail = value.object;
        console.log(this._customerDetail);
        // popup or redirect to another uri.
      }, error: err => {
        console.error(err)
        if (err.error.details.length != 0) {
          Swal.fire({
            title: err.error.details[0],
            icon: 'error',
            timer: 3000
          });
        } else {
          Swal.fire({
            title: err.error.message,
            icon: 'error',
            timer: 3000
          });
        }
      }
    })
  }

  // Make an API call to edit the customer with the given id
  editCustomer(id: number) {
    // this.customerService.updateCustomerDetail(id).subscribe({
    //   next: value => {
    //     this._customerDetail = value.object;
    //     console.log(this._customerDetail);
    //     // popup or redirect to another uri.
    //   }, error: err => {
    //     console.error(err)
    //     if (err.error.details.length != 0) {
    //       Swal.fire({
    //         title: err.error.details[0],
    //         icon: 'error',
    //         timer: 3000
    //       });
    //     } else {
    //       Swal.fire({
    //         title: err.error.message,
    //         icon: 'error',
    //         timer: 3000
    //       });
    //     }
    //   }
    // })
  }

  // popUpCustomerForm(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
  //     (result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     },
  //     (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     },
  //   );
  // }


  // Make an API call to delete the customer with the given id
  deleteCustomer(id: number) {
  }

  get customerList(): CustomerListResponse[] {
    return this._customerList;
  }

  get customerDetail(): CustomerDetails {
    return this._customerDetail;
  }


}
