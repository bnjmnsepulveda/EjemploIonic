import { LoginService } from './login.service';
import { WebsocketService } from './websocket.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MensajeChat, Conversacion, UsuarioEscribiendo, ContactoAgente } from '../domain/cckall.domain';
import * as api from '../../config/config';
import { Observable, Subject } from 'rxjs';
import { MensajeNuevoMensajeChat } from '../domain/websocket.domain';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private usuario: ContactoAgente;
  private conversaciones: Conversacion[] = [];
  // --- comunicacion entre componentes y servicios ---
  mensajeNuevo$: Subject<MensajeNuevoMensajeChat> = new Subject();
  usuarioInicioEscribiendo: Subject<UsuarioEscribiendo> = new Subject();
  usuarioFinEscribiendo: Subject<UsuarioEscribiendo> = new Subject();
  
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) { }


  usuarioApp(): ContactoAgente {
    return this.loginService.getUsuario();
  }

  enviarMensaje(conversacionId: number, mensaje: MensajeChat): Observable<MensajeChat> {
    const url = api.WEBSERVICE_VIDEOLLAMADAS + `/mensajeria/conversacion/${conversacionId}/mensaje`;
    return this.http.post<MensajeChat>(url , mensaje, httpOptions);
  }

  enviarInicioEscribiendo(conversacionId: number, usuarioId: number): Observable<any> {
    const url = api.WEBSERVICE_VIDEOLLAMADAS + `/mensajeria/conversacion/${conversacionId}/escribiendo/inicio/${usuarioId}`;
    return this.http.post(url, {});
  }

  enviarFinEscribiendo(conversacionId: number, usuarioId: number): Observable<any> {
    const url = api.WEBSERVICE_VIDEOLLAMADAS + `/mensajeria/conversacion/${conversacionId}/escribiendo/fin/${usuarioId}`;
    return this.http.post(url, {});
  }

  notificarNuevaConversacion(conversacion: Conversacion) {
    const url = api.WEBSERVICE_VIDEOLLAMADAS + '/mensajeria/conversacion/notificar';
    return this.http.post<Conversacion>(url, conversacion);
  }

  inicioEscribiendo(escribiendo: UsuarioEscribiendo) {
    this.usuarioInicioEscribiendo.next(escribiendo);
  }

  finEscribiendo(escribiendo: UsuarioEscribiendo) {
    this.usuarioFinEscribiendo.next(escribiendo);
  }

  nuevoMensaje(mensaje: MensajeNuevoMensajeChat) {
    this.mensajeNuevo$.next(mensaje);
  }

  getMensajesChat(): Observable<MensajeNuevoMensajeChat> {
    return this.mensajeNuevo$.asObservable();
  }

  getUsuariosEscribiendo(): Observable<UsuarioEscribiendo> {
    return this.usuarioInicioEscribiendo.asObservable();
  }

  getUsuariosFinEscribiendo(): Observable<UsuarioEscribiendo> {
    return this.usuarioFinEscribiendo.asObservable();
  }
}
