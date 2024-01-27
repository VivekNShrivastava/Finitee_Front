import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateEditServiceRequiredPage } from './create-edit-service-required.page';

describe('CreateEditServiceRequiredPage', () => {
  let component: CreateEditServiceRequiredPage;
  let fixture: ComponentFixture<CreateEditServiceRequiredPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditServiceRequiredPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditServiceRequiredPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
