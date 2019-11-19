# Granula

Is a lightweight alternative to Angular (like Preact for React).
Right now on `State 0`. Not stable, but ready for production

## QuickStart

```bash
npm i -S @granulajs/platform-browser-granula
```

Add `GranularBrowserModule` right after `BrowserModule`

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// add this line
import { GranulaBrowserModule } from '@granulajs/platform-browser-granula';

@NgModule({
  declarations: [
    AppComponent
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

- [x] JIT Runtime
- [x] AOT Runtime
- [x] Simple version of Garbage Change Detection
- [ ] Fix for HttpParams encoding (https://github.com/angular/angular/issues/18261)

### Stage 1

- [ ] Full version of Garbage Change Detection
- [ ] Dumb template parser (using DOM parser)
- [ ] @granula/cli
- [ ] @granula/router (smaller/faster)

### Stage 2

- [ ] Stable release
