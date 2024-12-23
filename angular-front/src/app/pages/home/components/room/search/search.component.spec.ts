import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRoomComponent } from './search.component';

describe('SearchRoomComponent', () => {
  let component: SearchRoomComponent;
  let fixture: ComponentFixture<SearchRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
