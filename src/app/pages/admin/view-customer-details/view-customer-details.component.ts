import {Component} from '@angular/core';

@Component({
  selector: 'app-view-customer-details',
  templateUrl: './view-customer-details.component.html',
  styleUrls: ['./view-customer-details.component.css']
})
export class ViewCustomerDetailsComponent {
  categories = [
    {
      cid: 23,
      title: 'programming with JAVA',
      description: 'java brains'
    },
    {
      cid: 24,
      title: 'Angular',
      description: 'CodeEvolution'
    }
    ,
    {
      cid: 25,
      title: 'JS & TS',
      description: 'The Thorben Jansen'
    }

  ]
}
