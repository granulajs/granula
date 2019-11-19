import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-custom-platform';
  list = [];

  constructor() {
    this.list = new Array(4000).fill(0);
  }
}
