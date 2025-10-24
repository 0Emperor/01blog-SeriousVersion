import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentUsers } from './recent-users';

describe('RecentUsers', () => {
  let component: RecentUsers;
  let fixture: ComponentFixture<RecentUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
