import { Injectable, HostListener } from '@angular/core';
import { ContactoAgente, Conversacion } from '../domain/cckall.domain';
import { OpenVidu, Session, StreamManager, Publisher, StreamEvent, PublisherProperties, Stream, Subscriber } from 'openvidu-browser';
import { Subject, Observable } from 'rxjs';
import { MensajeVideoLLamada } from '../domain/websocket.domain';

@Injectable({
  providedIn: 'root'
})
export class VideollamadasService {
  // --- objetos de sesion de usuario ---
  usuarioApp: ContactoAgente;
  conversacionIniciada: Conversacion;
  mensajeVideollamada: MensajeVideoLLamada;
  videollmadaId: string;
  tokenVideollamada: string;
  // --- objetos openvidu ---
   OV: OpenVidu;
   session: Session;
   publisher: StreamManager; // Local
   subscribers: StreamManager[] = []; // Remotes
   // Main video of the page, will be 'publisher' or one of the 'subscribers',
   // updated by click event in UserVideoComponent children
   mainStreamManager: StreamManager;

   // --- OBSERVABLES PARA SERVICIO ---
   subjectConnect$: Subject<Publisher>;
   subjectStreamCreated$: Subject<StreamEvent>;
   subjectStreamDestroyed$: Subject<StreamEvent>;

  constructor(
  ) { }

 connectVideollamadas(token: string, username: string, properties: PublisherProperties): Observable<any> {
   this.OV = new OpenVidu();
   this.session = this.OV.initSession();
   // --- On every new Stream received... ---
   this.subjectStreamCreated$ = new Subject();
   this.subjectStreamDestroyed$ = new Subject();
   this.subjectConnect$ = new Subject();
   this.session.on('streamCreated', (eventStreamCreated: StreamEvent) => {
     this.subjectStreamCreated$.next(eventStreamCreated);
   });
   // --- On every Stream destroyed... ---
   this.session.on('streamDestroyed', (eventStreamDestroyed: StreamEvent) => {
     this.subjectStreamDestroyed$.next(eventStreamDestroyed);
   });
   // --- CONEXION SERVICIO VIDEOLLAMADA OPENVIDU ---
   this.session.connect(token, { clientData: username })
     .then(() => {
       const publisher: Publisher = this.OV.initPublisher(undefined, properties);
       this.session.publish(publisher);
       this.subjectConnect$.next(publisher);
     }).catch(error => {
       this.subjectConnect$.error(error);
     });
     return this.subjectConnect$.asObservable();
 }

 subscribeSession(stream: Stream, targetElement: string): Subscriber {
   return this.session.subscribe(stream, targetElement);
 }

 getStreamCreated() {
   return this.subjectStreamCreated$.asObservable();
 }

 getStreamDestroyed() {
   return this.subjectStreamDestroyed$.asObservable();
 }

 disconnectVideollamadaSession() {
   // --- Leave the session by calling 'disconnect' method over the Session object ---
   if (this.session) {
     this.session.disconnect();
   }
   this.subjectStreamCreated$.complete();
   this.subjectStreamDestroyed$.complete();
   this.subjectConnect$.complete();
   // --- Empty all properties...---
   this.subscribers = [];
   delete this.publisher;
   delete this.session;
   delete this.OV;
}

 deleteSubscriber(streamManager: StreamManager): void {
   const index = this.subscribers.indexOf(streamManager, 0);
   if (index > -1) {
     this.subscribers.splice(index, 1);
   }
 }

 updateMainStreamManager(streamManager: StreamManager) {
   this.mainStreamManager = streamManager;
 }

 @HostListener('windows:beforeunload', ['$event'])
 eventCloseWindows(event: BeforeUnloadEvent) {
   this.disconnectVideollamadaSession();
 }

 setConversacion(conversacion: Conversacion) {
   this.conversacionIniciada = conversacion;
 }

 getConversacion() {
   return this.conversacionIniciada;
 }

 setVideollamadaId(videollamadaId: string) {
   this.videollmadaId = videollamadaId;
 }

 getVideollamadaId() {
   return this.videollmadaId;
 }

 settokenVideollamada(tokenVideollamada: string) {
   this.tokenVideollamada = tokenVideollamada;
 }

 getTokenVideollamada() {
   return this.tokenVideollamada;
 }

 setMensajeVideollamada(mensajeVideollamada: MensajeVideoLLamada) {
   this.mensajeVideollamada = mensajeVideollamada;
 }

 getMensajeVideollamada() {
   return this.mensajeVideollamada;
 }
}
