import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSection } from './notification-section';

describe('NotificationSection', () => {
  let component: NotificationSection;
  let fixture: ComponentFixture<NotificationSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
