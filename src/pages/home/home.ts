import { Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public cards = [{
    hasVideo: false,
    src: 'assets/imgs/poster01.jpg',
    avatarSrc: 'assets/imgs/avatar01.jpg',
    name: 'Ian',
    location: 'Dallas'
  }, {
    hasVideo: true,
    src: 'assets/videos/video01.mp4',
    avatarSrc: 'assets/imgs/avatar02.jpg',
    name: 'Sarah',
    location: 'Huntington Park'
  }, {
    hasVideo: false,
    src: 'assets/imgs/poster02.jpg',
    avatarSrc: 'assets/imgs/avatar03.jpg',
    name: 'Marty',
    location: 'Roslyndale Avenue'
  }];

  constructor() { }

}