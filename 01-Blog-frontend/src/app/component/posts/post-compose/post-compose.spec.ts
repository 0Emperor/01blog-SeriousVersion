import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCompose } from './post-compose';

describe('PostCompose', () => {
  let component: PostCompose;
  let fixture: ComponentFixture<PostCompose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCompose]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCompose);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
