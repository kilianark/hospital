import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaccesComponent } from './noacces.component';

describe('NoaccesComponent', () => {
  let component: NoaccesComponent;
  let fixture: ComponentFixture<NoaccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoaccesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
