import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembroTribunalModalComponent } from './miembro-tribunal-modal.component';

describe('MiembroTribunalModalComponent', () => {
  let component: MiembroTribunalModalComponent;
  let fixture: ComponentFixture<MiembroTribunalModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiembroTribunalModalComponent]
    });
    fixture = TestBed.createComponent(MiembroTribunalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
