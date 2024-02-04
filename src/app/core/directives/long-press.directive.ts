import {
    Directive,
    ElementRef,
    Input,
    AfterViewInit,
    NgZone,
    EventEmitter,
    Output,
    HostListener
} from "@angular/core";
import { GestureController } from "@ionic/angular";

@Directive({
    selector: "[long-press]",
    standalone: true,
})
export class LongPressDirective implements AfterViewInit {

    @Output() press = new EventEmitter();
    @Input('data') data: any;
    @Input("delay") delay = 500;
    action: any; //not stacking actions
    private isSelected = false;

    private longPressActive = false;

    constructor(
        private el: ElementRef,
        private gestureCtrl: GestureController,
        private zone: NgZone
    ) { }

    ngAfterViewInit() {
        this.loadLongPressOnElement();
    }

    // loadLongPressOnElement() {
    //     const gesture = this.gestureCtrl.create({
    //         el: this.el.nativeElement,
    //         threshold: 0,
    //         gestureName: 'long-press',
    //         onStart: ev => {
    //             this.longPressActive = true;
    //             this.longPressAction();
    //         },
    //         onEnd: ev => {
    //             this.longPressActive = false;
    //         }
    //     });
    //     gesture.enable(true);
    // }

    // private longPressAction() {
    //     if (this.action) {
    //         clearInterval(this.action);
    //     }
    //     this.action = setTimeout(() => {
    //         this.zone.run(() => {
    //             if (this.longPressActive === true) {
    //                 console.log("deselecting...");
    //                 this.longPressActive = false;
    //                 this.press.emit(this.data);
    //             }
    //         });
    //     }, this.delay);
    // }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.longPressActive) {
            // Toggle selection on click
            this.isSelected = !this.isSelected;
            console.log("toggling selection...");
            this.press.emit({ data: this.data, isSelected: this.isSelected });

            // If it's not a long press, reset the isSelected state after a short delay
            setTimeout(() => {
                this.zone.run(() => {
                    this.isSelected = false;
                });
            }, 200);
        }
    }

    private loadLongPressOnElement() {
        const longPressGesture = this.gestureCtrl.create({
            el: this.el.nativeElement,
            threshold: 0,
            gestureName: 'long-press',
            onStart: ev => {
                this.longPressActive = true;
                this.longPressAction();
            },
            onEnd: ev => {
                this.longPressActive = false;
            }
        });

        longPressGesture.enable(true);
    }

    private longPressAction() {
        if (this.delay === 0) {
            this.handleSelection();
        } else {
            setTimeout(() => {
                this.zone.run(() => {
                    if (this.longPressActive === true) {
                        this.handleSelection();
                    }
                });
            }, this.delay);
        }
    }

    private handleSelection() {
        this.isSelected = true;
        console.log("selecting...");
        this.press.emit({ data: this.data, isSelected: this.isSelected });
    }
    
}