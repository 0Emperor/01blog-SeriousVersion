import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPosts } from './all-posts';

describe('AllPosts', () => {
  let component: AllPosts;
  let fixture: ComponentFixture<AllPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
