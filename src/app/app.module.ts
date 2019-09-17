import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TestPopoverComponent } from './components/test-popover/test-popover.component';
import { MatCardModule, MatButtonModule, MatTooltipModule, MatFormFieldModule } from '@angular/material';
import { PopoverComponent } from './pages/popover/popover.component';

import { MaterialExtendModule } from './material-extend/material-extend.module';
import { TimepickerComponent } from './pages/timepicker/timepicker.component';

@NgModule({
  declarations: [
    AppComponent,
    TestPopoverComponent,
    PopoverComponent,
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
    MaterialExtendModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
