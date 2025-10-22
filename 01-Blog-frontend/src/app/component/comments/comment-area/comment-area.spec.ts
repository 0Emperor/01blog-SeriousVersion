import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentArea } from './comment-area';

describe('CommentArea', () => {
  let component: CommentArea;
  let fixture: ComponentFixture<CommentArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
