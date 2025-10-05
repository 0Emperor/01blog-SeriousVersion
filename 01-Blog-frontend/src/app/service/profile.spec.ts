import { TestBed } from '@angular/core/testing';

import { ProfileS } from './profile';

describe('Profile', () => {
  let service: ProfileS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
