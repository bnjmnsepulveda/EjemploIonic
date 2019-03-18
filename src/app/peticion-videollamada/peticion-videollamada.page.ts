import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { WebsocketService } from '../shared/services/websocket.service';
import { TipoMensaje } from '../shared/domain/websocket.domain';
import { VideollamadasService } from '../shared/services/videollamadas.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Conversacion } from '../shared/domain/cckall.domain';
import { LoginService } from '../shared/services/login.service';

@Component({
  selector: 'app-peticion-videollamada',
  templateUrl: './peticion-videollamada.page.html',
  styleUrls: ['./peticion-videollamada.page.scss'],
})
export class PeticionVideollamadaPage implements OnInit {

  tipoLlamada: string;
  conversacionIniciada: Conversacion;
  @ViewChild('audioControl')
  audioEl: ElementRef;

  constructor(
    private websocketService: WebsocketService,
    private videollamadaService: VideollamadasService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loginService: LoginService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.activeRoute.params
    .subscribe((params: Params) => {
      this.tipoLlamada = params.tipo;
      this.playRingtone();
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

  aceptar() {
    console.log('Videollamada aceptada');
    const contenido = {
        videollamadaId : this.videollamadaService.getMensajeVideollamada().videollamadaId,
        conversacionId : this.conversacionIniciada.id,
        emisor : this.videollamadaService.getMensajeVideollamada().emisor,
        participanteActivo: this.loginService.getUsuario()
      };
    this.websocketService.enviarMensajeWebsocket(TipoMensaje.CONTESTAR_LLAMADA, contenido);
    this.stopRingtone();
  }

  rechazar() {
    console.log('Se rechaza la videollamada');
    const participantes = this.conversacionIniciada.participantes;
    const contenido = {
      videollamadaId: this.videollamadaService.getVideollamadaId(),
      notificarContactos: participantes
    };
    this.websocketService.enviarMensajeWebsocket(TipoMensaje.RECHAZAR_VIDEOLLAMADA, contenido);
    this.stopRingtone();
  }

  private playRingtone() {
    if (this.tipoLlamada === 'entrante') {
      this.renderer.selectRootElement(this.audioEl.nativeElement).play();
    }
  }

  private stopRingtone() {
    if (this.tipoLlamada === 'entrante') {
      this.renderer.selectRootElement(this.audioEl.nativeElement).pause();
    }
  }
}
