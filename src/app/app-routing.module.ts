import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PopoverComponent } from './pages/popover/popover.component';
import { TimepickerComponent } from './pages/timepicker/timepicker.component';

const routes: Routes = [
  {
    path: 'popover',
    component: PopoverComponent
  },
  {
    path: 'timepicker',
    component: TimepickerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
