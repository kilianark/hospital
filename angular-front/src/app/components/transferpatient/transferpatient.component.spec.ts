import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferpatientComponent } from './transferpatient.component';

describe('TransferpatientComponent', () => {
  let component: TransferpatientComponent;
  let fixture: ComponentFixture<TransferpatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferpatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferpatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
