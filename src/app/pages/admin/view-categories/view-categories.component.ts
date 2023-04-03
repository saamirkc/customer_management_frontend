import {Component} from '@angular/core';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css']
})
export class ViewCategoriesComponent {
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
