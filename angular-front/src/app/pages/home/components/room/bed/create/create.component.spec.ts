import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponentBed } from './create.component';

describe('CreateComponentBed', () => {
  let component: CreateComponentBed;
  let fixture: ComponentFixture<CreateComponentBed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateComponentBed],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateComponentBed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
