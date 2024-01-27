import { TestBed } from '@angular/core/testing';

import { SalesListingService } from './sales-listing.service';

describe('SalesListingService', () => {
  let service: SalesListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
