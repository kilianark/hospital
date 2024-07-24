import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBedComponent } from './search-bed.component';

describe('SearchBedComponent', () => {
  let component: SearchBedComponent;
  let fixture: ComponentFixture<SearchBedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
