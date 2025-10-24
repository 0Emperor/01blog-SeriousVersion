import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentReports } from './recent-reports';

describe('RecentReports', () => {
  let component: RecentReports;
  let fixture: ComponentFixture<RecentReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
