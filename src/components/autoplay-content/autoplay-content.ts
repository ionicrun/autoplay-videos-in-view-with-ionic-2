import { AutoplayVideoDirective } from './../../directives/autoplay-video/autoplay-video';
import { Component, ElementRef, NgZone, QueryList, ContentChildren, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'autoplay-content',
  template: `<ng-content></ng-content>`
})

export class AutoplayContentComponent implements OnInit, OnDestroy {

  @ContentChildren(
    AutoplayVideoDirective,
    {
      read: ElementRef,
      descendants: true
    }
  ) autoPlayVideoRefs: QueryList<AutoplayVideoDirective>;

  private intersectionObserver: IntersectionObserver;
  private mutationObserver: MutationObserver;

  private play: Promise<any>;

  constructor(

    private element: ElementRef,
    public ngZone: NgZone

  ) { }


  public ngOnInit() {

    // we can run this outside the ngZone, no need
    // to trigger change detection
    this
      .ngZone
      .runOutsideAngular(() => {

        this.intersectionObserver = this.getIntersectionObserver();
        this.mutationObserver = this.getMutationObserver(this.element.nativeElement);

      });

  }


  // clean things ups
  public ngOnDestroy() {

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

  }


  // construct the InterSectionObserver and return it
  private getIntersectionObserver() {

    let intersectionObserver = new IntersectionObserver(
      // execute the onIntersection on ...
      entries => this.onIntersection(entries), {
        // the threshold intersection of 0 and 50%
        threshold: [0, 0.5]
      });

    return intersectionObserver;

  }
  

  // construct the MutationObserver and return it
  private getMutationObserver(containerElement: HTMLElement) {

    let mutationObserver = new MutationObserver(
      // execute the onDomChange
      () => this.onDomChange()
    );

    // at the very least, childList, attributes, or characterData
    // must be set to true
    const config = {
      attributes: true,
      characterData: true,
      childList: true
    };

    // attach the mutation observer to the container element
    // and start observing it
    mutationObserver.observe(containerElement, config);

    return mutationObserver;

  }


  private onDomChange() {

    // when the DOM changes, loop over each element
    // we want to observe for its interection,
    // and do observe it
    this
      .autoPlayVideoRefs
      .forEach((video: ElementRef) => {

        this
          .intersectionObserver
          .observe(video.nativeElement);

      });

  }


  private onIntersection(entries: IntersectionObserverEntry[]) {

    entries
      .forEach((entry: any) => {

        // get the video element
        let video = entry.target;

        // are we intersecting?
        if (!entry.isIntersecting) {

          return;
        }

        // play the video if we passed the threshold
        // of 0.5 and store the promise so we can safely
        // pause it again
        if (entry.intersectionRatio >= 0.5) {

          // for demo purposes we use a single video
          // this code can easely be 
          // extended to support multiple videos
          if (this.play === undefined) {
            this.play = video.play();
          }

        } else if (entry.intersectionRatio < 0.5) {

          // no need to pause something if it didn't start
          // playing yet.
          if (this.play !== undefined) {

            // wait for the promise to resolve,
            // then pause the video
            this
              .play
              .then(_ => {

                video.pause();
                this.play = undefined;

              });

          }

        }

      });

  }

}