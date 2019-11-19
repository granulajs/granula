import { Component } from '@angular/core';

@Component({
  selector: 'app-small',
  templateUrl: './small.component.html',
  styleUrls: ['./small.component.css']
})
export class SmallComponent {
  inc = 0;

  constructor() {
    setInterval(() => {
      this.inc++;
    }, this.rnd(20, 50));
  }

  rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min );
  }

}
