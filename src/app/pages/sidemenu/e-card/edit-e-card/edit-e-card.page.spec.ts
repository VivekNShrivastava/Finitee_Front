import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditECardPage } from './edit-e-card.page';

describe('EditECardPage', () => {
  let component: EditECardPage;
  let fixture: ComponentFixture<EditECardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditECardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
