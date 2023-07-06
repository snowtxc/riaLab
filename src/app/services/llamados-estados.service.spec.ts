import { TestBed } from '@angular/core/testing';

import { LlamadosEstadosService } from './llamados-estados.service';

describe('LlamadosEstadosService', () => {
  let service: LlamadosEstadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamadosEstadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
