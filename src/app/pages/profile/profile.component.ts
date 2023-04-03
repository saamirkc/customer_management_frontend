import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {interval, map, Observable, take} from "rxjs";

export interface PeriodicElement {
  column: string;
  data: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {column: "Username", data: "Saagar KC"},
  {column: "Userid", data: "SKC123"},
  {column: "Phone", data: "9816190656"},
  {column: "Role", data: "ADMIN"},
  {column: "Status", data: "Active"},
];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private _user = null;
  constructor(private loginService: LoginService) {
  }

  ngOnInit(): void {
    this._user = this.loginService.getCurrentUser();
    this.myObservable.subscribe({
      next: (value: any) => console.log(" The profiles observable is subscribed ",value),
      complete: () => console.log('Observable completed')
    });
    this.takeThree.subscribe(value =>{
      console.log(value);
    })

  }
  get user(): any {
    return this._user;
  }
  myObservable: any = new Observable(this.observer);
    observer(value : any){
    value.next('hello');
    value.next('world');
    value.complete();
  };
   numbers = interval(1000);
   takeThree = this.numbers.pipe(
     take(3),
     map((value) => Date.now()));

}
