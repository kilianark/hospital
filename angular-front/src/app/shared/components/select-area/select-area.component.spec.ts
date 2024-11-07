import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAreaComponent } from './select-area.component';

describe('SelectAreaComponent', () => {
  let component: SelectAreaComponent;
  let fixture: ComponentFixture<SelectAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
