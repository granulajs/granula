import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';

import { AppComponent } from './app.component';
import { GranulaBrowserModule } from '@granulajs/platform-browser-granula';
import { SmallComponent } from './small/small.component';

@NgModule({
  declarations: [
    AppComponent,
    SmallComponent
  ],
  imports: [
    BrowserModule,
    GranulaBrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
