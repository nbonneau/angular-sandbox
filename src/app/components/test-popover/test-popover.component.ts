import { Component, OnInit, Inject } from '@angular/core';
import { POPOVER_CONFIG, PopoverConfig } from 'src/app/material-extend/popover/popover.component';

@Component({
  selector: 'app-test-popover',
  templateUrl: './test-popover.component.html',
  styleUrls: ['./test-popover.component.css']
})
export class TestPopoverComponent implements OnInit {

  clicked: boolean;

  constructor(@Inject(POPOVER_CONFIG) public data: PopoverConfig) { }

  ngOnInit() {
    this.clicked = this.data.clicked;
  }

}
