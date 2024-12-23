import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSelectComponent } from './hospital-select.component';

describe('HospitalSelectComponent', () => {
  let component: HospitalSelectComponent;
  let fixture: ComponentFixture<HospitalSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
