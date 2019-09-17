import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TestPopoverComponent } from './components/test-popover/test-popover.component';
import { MatCardModule, MatButtonModule, MatTooltipModule, MatFormFieldModule } from '@angular/material';
import { PopoverComponent } from './pages/popover/popover.component';

import { MaterialExtendModule } from './material-extend/material-extend.module';
import { UtilComponent } from './pages/util/util.component';
import { NgxDataGridModule } from './ngx-data-grid/ngx-data-grid.module';
import { TimepickerComponent } from './pages/timepicker/timepicker.component';

@NgModule({
  declarations: [
    AppComponent,
    TestPopoverComponent,
    PopoverComponent,
    UtilComponent,
    TimepickerComponent
  ],
  entryComponents: [
    TestPopoverComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    // -----------------------------------------------------------
    MaterialExtendModule,
    NgxDataGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
