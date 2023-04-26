import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {TokenService} from "../../services/token/token.service";
import {CustomerService} from "../../services/customer/customer.service";
import {DataService} from "../../services/data.service";
import {CustomerDetails} from "../../models/customer-details";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ErrorhandlerService} from "../../services/errorhandler/errorhandler.service";
import {SuccessHandlerService} from "../../services/successhandler/success-handler.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private _customerDetail!: CustomerDetails;
  private _customerId?: string | null;

  private _safeProfileImageUrl?: SafeUrl;

  private _profileImageView?: string | ArrayBuffer | null;

  private profileImageMain?: File;

  constructor(private loginService: LoginService, private successHandlerService: SuccessHandlerService, private errorHandlerService: ErrorhandlerService, private tokenService: TokenService, private sanitizer: DomSanitizer, private customerService: CustomerService, private dataService: DataService,) {
    this.initializeCustomerDetail();
  }

  initializeCustomerDetail() {
    this._customerDetail = {
      address: "", citizenNumber: "", dateOfBirth: "", firstName: "", gender: "", lastName: "", mobileNumber: "",
      customerFamilyList: [], maritalStatus: false, status: "", userName: ""
    };
  }

  ngOnInit(): void {
    this._customerId = this.tokenService.getCustomerId()
    if (this._customerId) {
      this.subscribeCustomerDetailsById(this._customerId);
      this.subscribeProfileImage(this._customerId);
    }
  }

  subscribeCustomerDetailsById(customerId: string) {
    this.customerService.viewCustomerById(Number(customerId)).subscribe({
      next: value => {
        this._customerDetail = value.object;
      }, error: err => {
        this.errorHandlerService.handleError(err);
      }
    })
  }

  subscribeProfileImage(customerId: string) {
    this.customerService.getProfileImage(Number(customerId)).subscribe({
      next: value => {
        this._profileImageView = URL.createObjectURL(value);
        this._safeProfileImageUrl = this.getSanitizedUrl(this._profileImageView);
      }, error: err => {
        console.log("The error is thrown while fetching the profile image", err);
      }
    })
  }

  get customerDetail(): CustomerDetails {
    return this._customerDetail;
  }

  get profileImageView(): string {
    return <string>this._profileImageView;
  }

  public getSanitizedUrl(url: string): SafeUrl {
    if (this.sanitizer) {
      return this._safeProfileImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    } else {
      return this._safeProfileImageUrl = '';
    }
  }

  onProfileImageSelected(event: any) {
    this.profileImageMain = event.target.files[0];
    if (this.profileImageMain) {
      this.customerService.uploadProfileImage(this.profileImageMain, this._customerId).subscribe({
        next: value => {
          this.successHandlerService.handleSuccessEvent(value.message);
          const reader = new FileReader();
          if (this.profileImageMain) {
            reader.readAsDataURL(this.profileImageMain);
            reader.onload = (event) => {
              if (event.target != null) {
                this._profileImageView = event.target.result;
                this._safeProfileImageUrl = this.getSanitizedUrl(this.profileImageView);
              }
            }
          }
        }, error: err => {
          this.errorHandlerService.handleError(err);
        }
      })
    }
  }

  get safeProfileImageUrl(): SafeUrl {
    return <SafeUrl>this._safeProfileImageUrl;
  }
}
