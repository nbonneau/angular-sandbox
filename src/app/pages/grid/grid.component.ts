import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TestPopoverComponent } from 'src/app/components/test-popover/test-popover.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit {

  data: Array<any> = [];
  columns = [];
  rows = [];

  popoverComponent = TestPopoverComponent;

  constructor() { }

  ngOnInit() {
    this.setup();

    // setInterval(()=>{
    //   this.setup();
    // }, 5000);
  }

  setup() {
    this.columns = [];
    this.rows = [];
    this.data = [];
    for (let i = 0; i < 14; i++) {
      this.columns.push(i);
      for (let j = 0; j < 50; j++) {
        if (this.rows.indexOf(j) === -1) {
          this.rows.push(j);
        }
        if (Math.random() > 0.5) {
          this.data.push({
            x: i,
            y: j,
            text: i + '/' + j,
            key: 'this is a details for ' + i + '/' + j
          });
        }
      }
    }

    this.columns.push(14);
    this.columns.push(15);
  }

}
