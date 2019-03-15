import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-peticion-videollamada',
  templateUrl: './peticion-videollamada.page.html',
  styleUrls: ['./peticion-videollamada.page.scss'],
})
export class PeticionVideollamadaPage implements OnInit {

  saliente: boolean;

  constructor() { }

  ngOnInit() {
  }

  cancelar() {
    console.log('cancelando videollamada');
  }
}
