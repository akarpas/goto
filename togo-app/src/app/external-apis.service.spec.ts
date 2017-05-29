/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExternalApisService } from './external-apis.service';

describe('ExternalApisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalApisService]
    });
  });

  it('should ...', inject([ExternalApisService], (service: ExternalApisService) => {
    expect(service).toBeTruthy();
  }));
});
