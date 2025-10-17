import { TestBed } from '@angular/core/testing';

import { CommentShare } from './comment-share';

describe('CommentShare', () => {
  let service: CommentShare;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentShare);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
