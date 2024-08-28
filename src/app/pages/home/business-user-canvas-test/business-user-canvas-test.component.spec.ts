import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusinessUserCanvasTestComponent } from './business-user-canvas-test.component';

describe('BusinessUserCanvasTestComponent', () => {
  let component: BusinessUserCanvasTestComponent;
  let fixture: ComponentFixture<BusinessUserCanvasTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessUserCanvasTestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessUserCanvasTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
