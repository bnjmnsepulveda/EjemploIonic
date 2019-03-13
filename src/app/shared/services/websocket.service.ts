import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { MensajeWebsocket, TipoMensaje, ContenidoMensaje } from '../domain/websocket.domain';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class WebsocketService {

    // url = api.WEBSOCKET_VIDEOLLAMADAS;
    url = 'wss://192.168.0.36:5000/chat';
    private subject$: Subject<MessageEvent>;
    private subjectMensajes$: Subject<MensajeWebsocket<any>>;
    private subjectConexion$: Subject<string>;

    constructor() {
      console.log('inicio servicio websocket');
     }

    private connect(): Subject<MessageEvent> {
      this.subjectConexion$ = new Subject();
      this.subject$ = this.create();
      console.log('WebsocketService conectado exitosamente!!!');
      return this.subject$;
    }

    private create(): Subject<MessageEvent> {

      const ws = new WebSocket(this.url);
      ws.onopen = (data) => {
         console.log('Conexion websocket establecida...');
         this.subjectConexion$.next('Conexion exitosa a ' + this.url);
         this.subjectConexion$.complete();
      };
      const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
          ws.onmessage = obs.next.bind(obs);
          ws.onerror = obs.error.bind(obs);
          ws.onclose = obs.complete.bind(obs);
          return ws.close.bind(ws);
      });
      const observer = {
          next: (data: Object) => {
              if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify(data));
              } else {
                console.log('no se entrego msg=' + JSON.stringify(data) + ' conexion aun no esta abierta');
              }
          }
      };
      return Subject.create(observer, observable);
    }

    getConnection(): Observable<string>  {
      this.subjectMensajes$ = <Subject<MensajeWebsocket<any>>> this.connect()
      .pipe(
        map((response: MessageEvent): MensajeWebsocket<any> => {
          const data = JSON.parse(response.data);
          return data;
      })
      );
      return this.subjectConexion$.asObservable();
    }

    getMensajes(): Observable<MensajeWebsocket<any>> {
      return this.subjectMensajes$.asObservable();
    }

    enviarMensajeWebsocket(tipoMensaje: TipoMensaje, contenido: any): void {
      const req = new MensajeWebsocket();
      req.contenido = contenido;
      req.fecha = new Date();
      req.tipoMensaje = tipoMensaje;
      this.subjectMensajes$.next(req);
    }

}