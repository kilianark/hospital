import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPipeComponent } from './select-pipe.component';

describe('SelectPipeComponent', () => {
  let component: SelectPipeComponent;
  let fixture: ComponentFixture<SelectPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
