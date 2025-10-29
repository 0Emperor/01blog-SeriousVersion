import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReports } from './all-reports';

describe('AllReports', () => {
  let component: AllReports;
  let fixture: ComponentFixture<AllReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
