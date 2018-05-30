import {Component, Input, OnChanges,  OnInit, SimpleChange} from '@angular/core';
import {Image} from '../images/image'

@Component({
  selector: 'app-magic-box',
  templateUrl: './magic-box.component.html',
  styleUrls: ['./magic-box.component.less']
})
export class MagicBoxComponent implements OnInit, OnChanges {

  @Input('image') currentImage: Image;
  modal = null;
  overlay = null;
  constructor() { }

  ngOnInit() {
  }

  closeModal(){
    this.modal = document.querySelector(".magic-box");
    this.overlay = document.querySelector(".fixed-overlay");
    this.modal.classList.remove("show");
    document.querySelector(".fixed-overlay").classList.remove('noscroll');;
    this.overlay.classList.add("hide");
  }
  ngOnChanges(changes : {[propKey:string]: SimpleChange}) {
    for(let p in changes){
      let c = changes[p];
      if(c.currentValue){
        console.log(c.currentValue);
      }
    }
  }
}
