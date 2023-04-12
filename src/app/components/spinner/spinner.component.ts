import {Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit{
  ngOnInit(): void {
    console.log("spinner component is invoked")
  }

}
