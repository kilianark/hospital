import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalEpisodeComponent } from './medical-episode.component';

describe('MedicalEpisodeComponent', () => {
  let component: MedicalEpisodeComponent;
  let fixture: ComponentFixture<MedicalEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalEpisodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
