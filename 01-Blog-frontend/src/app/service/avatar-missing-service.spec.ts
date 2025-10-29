import { TestBed } from '@angular/core/testing';

import { AvatarMissingService } from './avatar-missing-service';

describe('AvatarMissingService', () => {
  let service: AvatarMissingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarMissingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
