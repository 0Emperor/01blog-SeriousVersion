import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentAdd } from './comment-add';

describe('CommentAdd', () => {
  let component: CommentAdd;
  let fixture: ComponentFixture<CommentAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
