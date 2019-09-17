import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDataGridComponent } from './ngx-data-grid.component';
import { UtilModule } from '../material-extend/utils/util.module';

@NgModule({
  imports: [
    CommonModule,
    UtilModule
  ],
  exports: [
    NgxDataGridComponent
  ],
  declarations: [
    NgxDataGridComponent
  ]
})
export class NgxDataGridModule { }
