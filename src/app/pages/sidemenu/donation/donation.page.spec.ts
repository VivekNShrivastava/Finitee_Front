import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NonprofitDonationMainOwnPage } from './donation.page';

describe('NonprofitDonationMainOwnPage', () => {
  let component: NonprofitDonationMainOwnPage;
  let fixture: ComponentFixture<NonprofitDonationMainOwnPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NonprofitDonationMainOwnPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NonprofitDonationMainOwnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
