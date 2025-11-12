import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitMovie } from './submit-movie';

describe('SubmitMovie', () => {
  let component: SubmitMovie;
  let fixture: ComponentFixture<SubmitMovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitMovie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitMovie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
