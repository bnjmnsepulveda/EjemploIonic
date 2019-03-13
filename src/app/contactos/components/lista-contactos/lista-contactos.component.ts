import { ContactoAgente } from './../../domain/cckall.domain';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss']
})
export class ListaContactosComponent implements OnInit {

  @Input()
  contactos: ContactoAgente[];
  @Output()
  seleccionarContacto = new EventEmitter<ContactoAgente>();
  @Output()
  chatContacto = new EventEmitter<ContactoAgente>();
  @Output()
  videollamadaContacto = new EventEmitter<ContactoAgente>();

  constructor(
  ) { }

  ngOnInit() {
  }

  onSeleccionarContacto(contacto: ContactoAgente): void {
    this.seleccionarContacto.emit(contacto);
  }

  onChatContacto(contacto: ContactoAgente): void {
    this.seleccionarContacto.emit(contacto);
  }

  onVideollamadaContacto(contacto: ContactoAgente): void {
    this.seleccionarContacto.emit(contacto);
  }

}
