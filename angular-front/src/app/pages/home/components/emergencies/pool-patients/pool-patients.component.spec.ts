import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolPatientsComponent } from './pool-patients.component';

describe('PoolPatientsComponent', () => {
  let component: PoolPatientsComponent;
  let fixture: ComponentFixture<PoolPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolPatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
