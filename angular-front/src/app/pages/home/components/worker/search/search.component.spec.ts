import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWorkerComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchWorkerComponent;
  let fixture: ComponentFixture<SearchWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
