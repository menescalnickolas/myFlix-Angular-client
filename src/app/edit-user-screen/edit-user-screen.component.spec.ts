import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserScreenComponent } from './edit-user-screen.component';

describe('EditUserScreenComponent', () => {
  let component: EditUserScreenComponent;
  let fixture: ComponentFixture<EditUserScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserScreenComponent]
    });
    fixture = TestBed.createComponent(EditUserScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
