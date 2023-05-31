import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadosEstadosPosiblesComponent } from './llamados-estados-posibles.component';

describe('LlamadosEstadosPosiblesComponent', () => {
  let component: LlamadosEstadosPosiblesComponent;
  let fixture: ComponentFixture<LlamadosEstadosPosiblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlamadosEstadosPosiblesComponent]
    });
    fixture = TestBed.createComponent(LlamadosEstadosPosiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
