import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusinessOtherMenuModalPage } from './business-other-menu-modal.page';

describe('BusinessOtherMenuModalPage', () => {
  let component: BusinessOtherMenuModalPage;
  let fixture: ComponentFixture<BusinessOtherMenuModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessOtherMenuModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessOtherMenuModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
