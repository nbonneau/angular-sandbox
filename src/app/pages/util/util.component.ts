import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-util',
  templateUrl: './util.component.html',
  styleUrls: ['./util.component.sass']
})
export class UtilComponent implements OnInit {

  scrollStates: Array<string> = [];

  constructor() { }

  ngOnInit() {
    
  }

}
