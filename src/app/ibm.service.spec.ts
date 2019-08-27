import { TestBed } from '@angular/core/testing';

import { IbmService } from './ibm.service';

describe('IbmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IbmService = TestBed.get(IbmService);
    expect(service).toBeTruthy();
  });
});
