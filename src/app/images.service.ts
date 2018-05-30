import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Image } from './images/image';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class ImagesService {
  imagesUrl = 'https://api.flickr.com/services/rest/';
  finalUrl = "";
  textString = "";
  isChange = false;
  urlJson ={
    api_key:"bc487e42bd36a98762e83946bdfa1a26",
    extras:'url_m,url_c,url_l,url_h,url_o',
    format:'json',
    method:'flickr.photos.getRecent',
    nojsoncallback:'1',
    page:'1',
    per_page:'21',
    text:''
  }
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ImagesService');
  }

  toggle(text) {
    this.isChange = true;
    this.textString = text;
    this.change.emit(this.isChange);
  }



  /** GET heroes from the server */
  getImages (): Observable<Image[]> {
    this.finalUrl = this.imagesUrl + this.jsonToQueryString(this.urlJson);
    return this.http.get<Image[]>(this.finalUrl)
      .pipe(
        catchError(this.handleError('getHeroes', []))
      );
  }


  jsonToQueryString = function(json) {
    return '?' +
      Object.keys(json).map(function(key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(json[key]);
      }).join('&');
  }

  /* GET heroes whose name contains search term */
  searchImages(term: string): Observable<Image[]> {
    term = term.trim();
    this.urlJson.text = term;
    this.finalUrl = this.imagesUrl + this.jsonToQueryString(this.urlJson);
    return this.http.get<Image[]>(this.finalUrl)
      .pipe(
        catchError(this.handleError<Image[]>('searchImages', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addImage (hero: Image): Observable<Image> {
    return this.http.post<Image>(this.imagesUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('addImage', hero))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteImage (id: number): Observable<{}> {
    const url = `${this.imagesUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteImage'))
      );
  }
}
