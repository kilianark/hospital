import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedComponent } from '../../pages/home/components/room/bed/bed.component';

describe('BedComponent', () => {
  let component: BedComponent;
  let fixture: ComponentFixture<BedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
