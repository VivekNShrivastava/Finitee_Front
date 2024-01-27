import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FreeUserCanvasOtherMenuModalPage } from './home/free-user-canvas-other-menu-modal.page';

describe('FreeUserCanvasOtherMenuModalPage', () => {
  let component: FreeUserCanvasOtherMenuModalPage;
  let fixture: ComponentFixture<FreeUserCanvasOtherMenuModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeUserCanvasOtherMenuModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FreeUserCanvasOtherMenuModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
