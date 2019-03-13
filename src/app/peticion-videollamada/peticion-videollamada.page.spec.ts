import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticionVideollamadaPage } from './peticion-videollamada.page';

describe('PeticionVideollamadaPage', () => {
  let component: PeticionVideollamadaPage;
  let fixture: ComponentFixture<PeticionVideollamadaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeticionVideollamadaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeticionVideollamadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
