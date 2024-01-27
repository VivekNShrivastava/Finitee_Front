import { TestBed } from '@angular/core/testing';

import { InflowsService } from './inflows.service';

describe('InflowsService', () => {
  let service: InflowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InflowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
