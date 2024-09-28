import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewPostTestPage } from './preview-post-test.page';

describe('PreviewPostTestPage', () => {
  let component: PreviewPostTestPage;
  let fixture: ComponentFixture<PreviewPostTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPostTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
