import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPostTestPage } from './add-post-test.page';

describe('AddPostTestPage', () => {
  let component: AddPostTestPage;
  let fixture: ComponentFixture<AddPostTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
