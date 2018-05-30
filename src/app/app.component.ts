import {Component, OnInit} from '@angular/core';
import {Image} from "./images/image";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'app';
  textMessage = '';
  cokieeValue = [];
  currentImage = null;
  constructor() { }

  public searchString(text: string) {
    this.textMessage = text;
  }
  ngOnInit(){
    var cokiee = this.readCookie("searchTerm");
    if(cokiee){
      this.cokieeValue = cokiee.split(",");
      console.log(this.cokieeValue);
    }
  }
  public imageDetails(currentItem : Image){
    this.currentImage = currentItem;
  }
  readCookie (name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
}
