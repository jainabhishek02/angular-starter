import {Component, OnInit, Input, OnChanges, SimpleChange, EventEmitter, Output, HostListener} from '@angular/core';
import { Image } from './image';
import { ImagesService } from '../images.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  providers: [ ImagesService ],
  styleUrls: ['./images.component.less']
})
export class ImagesComponent  implements OnChanges {
  images: Image[];
  editImage: Image; // the hero currently being edited

  @Output() imageChange: EventEmitter<Image> = new EventEmitter();
  @Input('message') message: string;
  constructor(private imagesService: ImagesService) { }


  ngOnChanges(changes : {[propKey:string]: SimpleChange}) {
    for(let p in changes){
      let c = changes[p];
      if(c.currentValue){
        this.search(c.currentValue);
      }
    }
  }

  ngOnInit(){
    this.getImages();
  }

  getImages(): void {
    this.imagesService.getImages()
      .subscribe(resp => this.images = resp['photos']['photo']);
  }
  @HostListener('showDetails')
  showDetails(currentItem: Image):void{
    this.imageChange.emit(currentItem);
    let body = document.querySelector("body");
    let overlay = document.querySelector(".fixed-overlay");
    let modal = document.querySelector(".magic-box");
    overlay.classList.remove("hide");
    modal.classList.add("show");
    body.classList.add("noscroll");
    console.log(currentItem);
  }

  search(searchTerm: string) {
    if (searchTerm) {
      this.imagesService.searchImages(searchTerm)
        .subscribe(resp => this.images = resp['photos']['photo']);
    }
  }

  add(title: string): void {
    this.editImage = undefined;
    title = title.trim();
    if (!title) { return; }

    // The server will generate the id for this new hero
    const newImage: Image = { title } as Image;
    this.imagesService.addImage(newImage)
      .subscribe(hero => this.images.push(hero));
  }


  delete(hero: Image): void {
    this.images = this.images.filter(h => h !== hero);
    this.imagesService.deleteImage(hero.id).subscribe();
    /*
    // oops ... subscribe() is missing so nothing happens
    this.heroesService.deleteHero(hero.id);
    */
  }

}

