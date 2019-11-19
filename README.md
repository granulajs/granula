# Granula

Is a lightweight alternative to Angular (like Preact for React).
Right now on `State 0`.

## QuickStart

```bash
npm i -S @granulajs/platform-browser-granula
```

Add `GranularBrowserModule` right after `BrowserModule`

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';

import { AppComponent } from './app.component';
// add this line
import { GranulaBrowserModule } from '@granulajs/platform-browser-granula';
import { SmallComponent } from './small/small.component';

@NgModule({
  declarations: [
    AppComponent,
    SmallComponent
  ],
  imports: [
    BrowserModule,
    // and this line
    GranulaBrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Roadmap

### Stage 0

- [x] Simple version of Garbage Change Detection
- [ ] Fix for HttpParams encoding (https://github.com/angular/angular/issues/18261)
- [ ] @granula/router (smaller/faster)

### Stage 1

- [ ] Full version of Garbage Change Detection
- [ ] Dumb template parser (using DOM parser)
- [ ] @granula/cli
