import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../shared/services/websocket.service';
import { TipoMensaje } from '../shared/domain/websocket.domain';
import { VideollamadasService } from '../shared/services/videollamadas.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Conversacion } from '../shared/domain/cckall.domain';

@Component({
  selector: 'app-peticion-videollamada',
  templateUrl: './peticion-videollamada.page.html',
  styleUrls: ['./peticion-videollamada.page.scss'],
})
export class PeticionVideollamadaPage implements OnInit {

  tipoLlamada: string;
  conversacionIniciada: Conversacion;

  constructor(
    private websocketService: WebsocketService,
    private videollamadaService: VideollamadasService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activeRoute.params
    .subscribe((params: Params) => {
      this.tipoLlamada = params.tipo;
    });
    this.conversacionIniciada = this.videollamadaService.getConversacion();
  }

  cancelar() {
    console.log('cancelando videollamada');
    const contenido =  {
      videollamadaId: this.videollamadaService.getVideollamadaId(),
      notificarContactos: this.conversacionIniciada.participantes
    };
    this.websocketService.enviarMensajeWebsocket(TipoMensaje.SOLICITUD_CANCELAR_LLAMADA, contenido);
    this.router.navigate(['home']);
  }
}
