import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { ImagesService } from '../images.service';
import { Image } from '../images/image';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Output() text: EventEmitter<string> = new EventEmitter();

  constructor(private imagesService: ImagesService) { }
  textArray =[];

  ngOnInit() {

  }
  @HostListener('search')
  search(searchTerm: string) {
    searchTerm = searchTerm.trim();
    if (searchTerm) {
      this.text.emit(searchTerm);
      var textArray = this.readCookie('searchTerm') || [];
      if(this.textArray.indexOf(searchTerm) === -1){
        this.textArray.push(searchTerm);
      }
      this.createCookie("searchTerm", this.textArray, 1);
    }
  }
  handleInput(event: KeyboardEvent, searchTerm:string){
    if(event.which == 13){
      this.text.emit(searchTerm);
      var textArray = this.readCookie('searchTerm') || [];
      if(this.textArray.indexOf(searchTerm) === -1){
        this.textArray.push(searchTerm);
      }
      this.createCookie("searchTerm", this.textArray, 1);
      console.log(event);
    }
  }
  readCookie (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  createCookie(name,value,days) {
    var expires ='';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+ date.toUTCString();
    }
    else  expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  }

}
