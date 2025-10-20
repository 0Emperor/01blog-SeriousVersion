import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editGuardGuard } from './edit-guard-guard';

describe('editGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
