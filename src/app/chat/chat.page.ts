import { ChatService } from './../shared/services/chat.service';
import { LoginService } from './../shared/services/login.service';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { UsuarioChat, Conversacion, UsuarioEscribiendo, MensajeChat } from '../shared/domain/cckall.domain';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { ConversacionService } from '../shared/services/conversacion.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  usuario: UsuarioChat;
  conversacion: Conversacion;

  mensajesSegundoPlano: boolean;

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private conversacionService: ConversacionService,
    private loginService: LoginService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.usuario = this.loginService.getUsuario().usuarioChat;
    this.activatedRoute.params
    .pipe(
      switchMap((params: Params) => {
        return this.conversacionService.readById(params.conversacionId);
      }),
      tap(conversacion => console.log('Chat asociado a conversacion ' + JSON.stringify(conversacion)))
    ).subscribe(conversacion => this.conversacion = conversacion);
    // --- mensajes en segundo plano de chat no se mostraran con opacidad
    this.mensajesSegundoPlano = false;
  }
  /**
   * agrega opacidad a mensajes de chat cuando se abre la lista de botones fab con acciones de chat.
  */
  onToogleFabList() {
    this.mensajesSegundoPlano = !this.mensajesSegundoPlano;
  }

  onEnviarMensaje(text: string): void {
    console.log('enviar mensaje desde android:' + text);
    const mensaje: MensajeChat = {
      emisor: this.usuario,
      fecha: new Date(),
      contenido: text
    };
    this.chatService.enviarMensaje(this.conversacion.id, mensaje).subscribe();
  }

  onInicioEscribiendo(text: string) {
    console.log('INICIO ESCR=' + text);
  }

  onFinEscribiendo(text: string) {
    console.log('FIN ESCR=' + text);
  }

}
