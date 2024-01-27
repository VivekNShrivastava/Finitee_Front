import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingWordsmatchesListPage } from './shopping-wordsmatches-list.page';

describe('ShoppingWordsmatchesListPage', () => {
  let component: ShoppingWordsmatchesListPage;
  let fixture: ComponentFixture<ShoppingWordsmatchesListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingWordsmatchesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingWordsmatchesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
