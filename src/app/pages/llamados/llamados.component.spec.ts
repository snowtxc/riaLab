import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadosComponent } from './llamados.component';

describe('LlamadosComponent', () => {
  let component: LlamadosComponent;
  let fixture: ComponentFixture<LlamadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlamadosComponent]
    });
    fixture = TestBed.createComponent(LlamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
