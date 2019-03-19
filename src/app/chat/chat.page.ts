import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { UsuarioChat, Conversacion, UsuarioEscribiendo, MensajeChat } from '../shared/domain/cckall.domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @Input()
  usuario: UsuarioChat;
  @Input()
  conversacion: Conversacion;
  @Input()
  usuariosEscribiendo: UsuarioEscribiendo[];
  @Output()
  enviarMensaje = new EventEmitter<MensajeChat>();
  @Output()
  escribiendo = new EventEmitter<string>();
  @Output()
  inicioEscribiendo = new EventEmitter<string>();
  @Output()
  finEscribiendo = new EventEmitter<string>();
  @ViewChild('scrollMensajes') scroll: ElementRef;
  mensajes: Subscription;

  constructor() { }

  ngOnInit() {
  }

}
