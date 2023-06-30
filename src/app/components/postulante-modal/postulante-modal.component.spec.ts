import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulanteModalComponent } from './postulante-modal.component';

describe('PostulanteModalComponent', () => {
  let component: PostulanteModalComponent;
  let fixture: ComponentFixture<PostulanteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostulanteModalComponent]
    });
    fixture = TestBed.createComponent(PostulanteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
