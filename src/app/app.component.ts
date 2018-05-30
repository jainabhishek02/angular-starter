import {Component, OnInit} from '@angular/core';
import {Image} from "./images/image";
import { ImagesService } from './images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'app';
  textMessage = '';
  pageImages: Image[];
  cokieeValue = [];
  pageNumber = 1;
  currentImage = null;
  constructor(private imagesService: ImagesService) { }

  public searchString(text: string) {
    this.textMessage = text;
  }
  ngOnInit(){
    var cokiee = this.readCookie("searchTerm");
    if(cokiee){
      this.cokieeValue = cokiee.split(",");
    }
    var ref = this;
    window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        ref.pageNumber++;
        if(ref.pageNumber == 2){
          ref.imagesService.pageImages(ref.pageNumber.toString())
            .subscribe(resp=>{
              ref.pageImages = resp['photos']['photo'];
            })
        }
      }
    };
  }
  public imageDetails(currentItem : Image){
    this.currentImage = currentItem;
  }
  public pageUpdate(){
    ++this.pageNumber;
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
