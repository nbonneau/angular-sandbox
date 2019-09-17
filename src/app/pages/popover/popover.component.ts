import { Component } from '@angular/core';
import { TestPopoverComponent } from 'src/app/components/test-popover/test-popover.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css']
})
export class PopoverComponent {

  clicked: boolean;
  popoverComponent = TestPopoverComponent;

  popoverData1 = {
    key: 'value'
  };
  popoverData2 = {
    key: 'value'
  };

  refreshData = [];

  constructor() {
    setTimeout(() => {
      this.popoverData1 = {key: 'value_updated'};
    }, 5000);
  }

}
