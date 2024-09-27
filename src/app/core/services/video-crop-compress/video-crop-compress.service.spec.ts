import { TestBed } from '@angular/core/testing';

import { VideoCropCompressService } from './video-crop-compress.service';

describe('VideoCropCompressService', () => {
  let service: VideoCropCompressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoCropCompressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
