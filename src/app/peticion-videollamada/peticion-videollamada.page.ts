import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../shared/services/websocket.service';
import { TipoMensaje } from '../shared/domain/websocket.domain';
import { VideollamadasService } from '../shared/services/videollamadas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-peticion-videollamada',
  templateUrl: './peticion-videollamada.page.html',
  styleUrls: ['./peticion-videollamada.page.scss'],
})
export class PeticionVideollamadaPage implements OnInit {

  saliente: boolean;

  constructor(
    private websocketService: WebsocketService,
    private videollamadaService: VideollamadasService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  cancelar() {
    console.log('cancelando videollamada');
    const conversacionIniciada = this.videollamadaService.getConversacion();
    const contenido =  {
      videollamadaId: conversacionIniciada.id,
      notificarContactos: conversacionIniciada.participantes
    };
    this.websocketService.enviarMensajeWebsocket(TipoMensaje.SOLICITUD_CANCELAR_LLAMADA, contenido);
    this.router.navigate(['home']);
  }
}
