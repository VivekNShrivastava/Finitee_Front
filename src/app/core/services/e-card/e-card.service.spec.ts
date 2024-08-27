import { TestBed } from '@angular/core/testing';

import { ECardService } from './e-card.service';

describe('ECardService', () => {
  let service: ECardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ECardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
