import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateEditServiceAvailablePage } from './create-edit-service-available.page';

describe('CreateEditServiceAvailablePage', () => {
  let component: CreateEditServiceAvailablePage;
  let fixture: ComponentFixture<CreateEditServiceAvailablePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditServiceAvailablePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditServiceAvailablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
