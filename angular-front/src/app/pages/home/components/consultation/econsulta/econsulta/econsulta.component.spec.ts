import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconsultaComponent } from './econsulta.component';

describe('EconsultaComponent', () => {
  let component: EconsultaComponent;
  let fixture: ComponentFixture<EconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
