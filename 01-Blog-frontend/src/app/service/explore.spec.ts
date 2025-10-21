import { TestBed } from '@angular/core/testing';

import { Explore } from './explore';

describe('Explore', () => {
  let service: Explore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Explore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
