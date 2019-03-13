import { Component, OnInit } from '@angular/core';
import { ContactoAgenteService } from '../contactos/services/contacto-agente.service';
import { LoginService } from '../shared/services/login.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ContactoAgente } from '../shared/domain/cckall.domain';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../shared/services/websocket.service';
import { TipoMensaje, MensajeWebsocket } from '../shared/domain/websocket.domain';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tabId: string;
  usuario: ContactoAgente;
  contactos: ContactoAgente[];
  // conversaciones: Conversacion[];
  conectado: boolean;
   // --- subscripcion de mensajes ws ---
   subscripcionConexionWebsocket: Subscription;
   subscripcionMensajes: Subscription;

  constructor(
    private contactosService: ContactoAgenteService,
    private loginService: LoginService,
    private router: Router,
    private websocketService: WebsocketService
  ) { }

  ngOnInit() {
    this.usuario = this.loginService.getUsuario();
    console.log('Iniciando sesion ' + JSON.stringify(this.usuario));
    // --- subscripcion con websocket ---
    this.subscripcionMensajes = this.websocketService.getConnection()
    .pipe(
      tap( cx => {
        this.conectado = true;
        // --- enviar mensaje de registro de usuario ---
        this.websocketService.enviarMensajeWebsocket(TipoMensaje.REGISTRO_USUARIO, this.usuario);
        // ----- renderizacion visualizacion de loading component ---
        // setTimeout(() => this.loading = false, 3700);
      }),
      switchMap(cx => {
        return this.websocketService.getMensajes();
      })
    ).subscribe(
      msg => {
        this.processMensajeWebsocket(msg);
      },
      error => {
        console.log(`Error websocket ${error}`);
        // this.notificacionService.errorNotify(`Error conexion websocket :${error}`);
      },
      () => {
        console.log('se ha cerrado la conexion de websocket del servidor');
        this.router.navigate(['/']);
        // this.notificacionService.errorNotify('Se ha cerrado la conexion a servidor');
    });
    this.contactosService.readAll()
    .pipe(
      map( contactos => contactos.filter(c => c.id !== this.loginService.getUsuario().id))
    )
    .subscribe(contactos => {
      this.contactos = contactos;
      this.tabId = 'tabContactos';
    });
  }

  onChatContacto(contacto: ContactoAgente) {
    console.log('Chat con ' + JSON.stringify(contacto));
  }

  onVideollamadaContacto(contacto: ContactoAgente) {
    console.log('Videollamada con ' + JSON.stringify(contacto));
    this.router.navigate(['peticion_videollamada']);
  }

  processMensajeWebsocket(mensaje: MensajeWebsocket<any>) {
    console.log('MENSAJE-SERVER=' + JSON.stringify(mensaje));
  }
}
