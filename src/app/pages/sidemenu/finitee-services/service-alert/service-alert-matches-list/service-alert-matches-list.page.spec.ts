import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceAlertMatchesListPage } from './service-alert-matches-list.page';

describe('ServiceAlertMatchesListPage', () => {
  let component: ServiceAlertMatchesListPage;
  let fixture: ComponentFixture<ServiceAlertMatchesListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAlertMatchesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceAlertMatchesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
