import { NgModule, ApplicationRef } from '@angular/core';
import { GranulaApplicationRef } from './granula-application.ref';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    { provide: ApplicationRef, useClass: GranulaApplicationRef }
  ],
  exports: []
})
export class GranulaBrowserModule { }
