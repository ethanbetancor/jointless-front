import { TestBed } from '@angular/core/testing';

import { Id } from './id';

describe('Id', () => {
  let service: Id;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Id);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
