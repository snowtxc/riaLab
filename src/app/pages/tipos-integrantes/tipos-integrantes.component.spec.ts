import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposIntegrantesComponent } from './tipos-integrantes.component';

describe('TiposIntegrantesComponent', () => {
  let component: TiposIntegrantesComponent;
  let fixture: ComponentFixture<TiposIntegrantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TiposIntegrantesComponent]
    });
    fixture = TestBed.createComponent(TiposIntegrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
