import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwipeService {

  private messageSource = new BehaviorSubject("");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  setDirection(message: string) {
    this.messageSource.next(message);
  }

  public swipeNext() {
    this.setDirection("next");
  }

  public swipePrevious() {
    this.setDirection("previous");
  }
}
