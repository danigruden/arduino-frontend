import { TestBed } from '@angular/core/testing';

import { NgxHowlerService } from './ngx-howler.service';

describe('NgxHowlerService', () => {
  let service: NgxHowlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxHowlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
