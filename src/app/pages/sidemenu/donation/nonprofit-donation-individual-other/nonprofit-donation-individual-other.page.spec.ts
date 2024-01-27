import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NonprofitDonationIndividualOtherPage } from './nonprofit-donation-individual-other.page';

describe('NonprofitDonationIndividualOtherPage', () => {
  let component: NonprofitDonationIndividualOtherPage;
  let fixture: ComponentFixture<NonprofitDonationIndividualOtherPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NonprofitDonationIndividualOtherPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NonprofitDonationIndividualOtherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
