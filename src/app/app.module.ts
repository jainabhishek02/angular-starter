import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';
import { HttpClientXsrfModule } from '@angular/common/http';
import { ComponentLoaderService  } from './component-loader.service'

import { HttpErrorHandler }     from './http-error-handler.service';
import { RequestCache, RequestCacheWithMap } from './request-cache.service';
import { ImagesService } from './images.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MagicBoxComponent } from './magic-box/magic-box.component';
import { UploaderComponent }    from './uploader/uploader.component';
import { ImagesComponent } from './images/images.component';
import { PageImagesComponent } from './page-images/page-images.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MagicBoxComponent,
    UploaderComponent,
    ImagesComponent,
    PageImagesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
  ],
  providers: [
    HttpErrorHandler,
    ImagesService,
    ComponentLoaderService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
  ],
  bootstrap: [AppComponent],
  entryComponents: [PageImagesComponent]
})
export class AppModule { }
