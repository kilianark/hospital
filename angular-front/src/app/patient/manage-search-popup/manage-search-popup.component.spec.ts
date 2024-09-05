import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSearchPopupComponent } from './manage-search-popup.component';

describe('ManageSearchPopupComponent', () => {
  let component: ManageSearchPopupComponent;
  let fixture: ComponentFixture<ManageSearchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSearchPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
