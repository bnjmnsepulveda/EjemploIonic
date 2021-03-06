import { ChatService } from './../shared/services/chat.service';
import { AppModule } from './../app.module';
import { Component, OnInit } from '@angular/core';
import { ContactoAgenteService } from '../contactos/services/contacto-agente.service';
import { LoginService } from '../shared/services/login.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ContactoAgente, Conversacion } from '../shared/domain/cckall.domain';
import { Subscription, of, Observable, forkJoin } from 'rxjs';
import { WebsocketService } from '../shared/services/websocket.service';
import { TipoMensaje, MensajeWebsocket, MensajeVideoLLamada, MensajeNuevoMensajeChat } from '../shared/domain/websocket.domain';
import { ConversacionService } from '../shared/services/conversacion.service';
import { VideollamadasService } from '../shared/services/videollamadas.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  titulo: string;
  tabId: string;
  usuario: ContactoAgente;
  contactos: ContactoAgente[];
  conversaciones: Conversacion[];
  conversaciones$: Observable<Conversacion[]>;
  conectado: boolean;
  videollamadaEnProceso: boolean;
  saliente: boolean;
   // --- subscripcion de mensajes ws ---
   subscripcionConexionWebsocket: Subscription;
   subscripcionMensajes: Subscription;
   contactos$ = this.contactosService
   .readAll()
   .pipe(
     map( contactos => contactos.filter(c => c.id !== this.loginService.getUsuario().id))
   );

  constructor(
    private contactosService: ContactoAgenteService,
    private conversacionService: ConversacionService,
    private loginService: LoginService,
    private router: Router,
    private websocketService: WebsocketService,
    private videollamadasService: VideollamadasService,
    public alertController: AlertController,
    private chatService: ChatService
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
    this.contactos$
    .subscribe(contactos => {
      this.contactos = contactos;
      this.tabId = 'tabContactos';
    });
    this.conversacionService.readAll()
    .subscribe(conversaciones => this.conversaciones = conversaciones);
  }

  async onSeleccionarContacto(contacto: ContactoAgente) {
    this.onChatContacto(contacto);
    /*const btnChat = {
      text: 'Chat',
      role: 'accept',
      handler: () => {
        this.onChatContacto(contacto);
      }
    };
    const btnVideollamada = {
      text: 'VideoLLamada',
      role: 'accept',
      handler: () => {
        this.onVideollamadaContacto(contacto);
      }
    };
    const alert = await this.alertController.create({
      header: contacto.nombre,
      message: 'Comunicarse con ' + contacto.nombre,
      buttons: contacto.enLinea ? [ btnVideollamada, btnChat ] : [ btnChat ]
    });
    await alert.present();*/
  }

  async onSeleccionarConversacion(conversacion: Conversacion) {
    const alert = await this.alertController.create({
      header: conversacion.titulo,
      message: conversacion.descripcion,
      buttons: [
        {
          text: 'Chat',
          role: 'accept',
          handler: () => {
            // this.onChatContacto(conversacion);
          }
        },
        {
          text: 'VideoLLamada',
          role: 'accept',
          handler: () => {
            this.iniciarConversacion(conversacion);
          }
        }]
    });
    await alert.present();
  }

  iniciarConversacion(conversacion: Conversacion) {
     // --- variables de inicio de videollamada ---
     this.saliente = true; // <----------------- indica que yo estoy llamando
     this.videollamadaEnProceso = true; // <---- Indica que hay una videollamada ejecutandose (No debe entrar o salir ninguna)
     // --- FIN variables videollamadas ---
     const receptores$: Observable<ContactoAgente>[] = [];
     conversacion.participantes.forEach(p => receptores$.push(this.contactosService.readByUsuarioId(p.id)));
     forkJoin(receptores$)
     .subscribe( receptores => {
       // ### Crear MensajeWebsocket INICIAR_VIDEO_LLAMADA ###
       const contenido: MensajeVideoLLamada = {
        emisor: this.usuario,
        conversacionId: conversacion.id,
        receptores: receptores
       };
       console.log('> Enviando MensajeWebsocket=' + JSON.stringify(contenido));
       this.videollamadasService.setMensajeVideollamada(contenido);
       this.websocketService.enviarMensajeWebsocket(TipoMensaje.INICIAR_VIDEO_LLAMADA, contenido);
      });
  }

  onChatContacto(contacto: ContactoAgente) {
    console.log('Chat con ' + JSON.stringify(contacto));
    const emisor = this.usuario.usuarioChat;
    const receptor = contacto.usuarioChat;
    const subscripcionConversacion = this.conversacionService.readByParticipantes([emisor, receptor])
    .subscribe(
      conversacion => {
        if (conversacion) {
          // this.router.navigate(['home/chat/conversacion', conversacion.id]);
          this.router.navigate(['chat', conversacion.id]);
        } else {
          console.log('se creara conversacion nueva...');
          const conversacionNueva: Conversacion = {
            titulo: `Chat ${emisor.username} - ${receptor.username}`,
            descripcion: `Conversación privada entre ${emisor.username} y ${receptor.username}`,
            participantes: [emisor, receptor]
          };
          this.conversacionService.create(conversacionNueva)
          .pipe(
            switchMap(conversacionCreada => {
              // this.router.navigate(['home/chat/conversacion', conversacionCreada.id]);
              this.router.navigate(['chat', conversacionCreada.id]);
              return this.conversaciones$;
            })
          ).subscribe( conversacionesActualizadas => {
            this.conversaciones = conversacionesActualizadas;
          });
        }
        subscripcionConversacion.unsubscribe();
    });

//    this.router.navigate(['chat', contacto.id]);
  }

  onVideollamadaContacto(contacto: ContactoAgente) {
    console.log('Videollamada con ' + JSON.stringify(contacto));
   // if (this.conectado) {
      if (this.videollamadaEnProceso) { // si hay una videollamada en proceso no se hace nada.
        console.log('EXISTE UNA VIDEOLLAMADA EN PROCESO!!!');
        return;
      }
      const emisor = this.usuario.usuarioChat;
      const receptor = contacto.usuarioChat;
      const participantes = [emisor, receptor];
      this.conversacionService.readByParticipantes(participantes)
      .pipe(
        switchMap(conversacion => {
          if (conversacion == null) {
            const conversacionNueva: Conversacion = {
              titulo: `Chat ${emisor.username} - ${receptor.username}`,
              descripcion: `Conversación privada entre ${emisor.username} y ${receptor.username}`,
              participantes: [emisor, receptor]
            };
            return this.conversacionService.create(conversacionNueva);
          }
          return of(conversacion);
        })
      ).subscribe( conversacion => {
        console.log('iniciar videollamada a contacto : ' + JSON.stringify(contacto));
        // --- variables de inicio de videollamada ---
        this.saliente = true; // <----------------- indica que yo estoy llamando
        this.videollamadaEnProceso = true; // <---- Indica que hay una videollamada ejecutandose (No debe entrar o salir ninguna)
         // ### Crear MensajeWebsocket INICIAR_VIDEO_LLAMADA ###
        const receptores = [contacto];
        const contenido: MensajeVideoLLamada = {
          conversacionId: conversacion.id,
          emisor: this.usuario,
          receptores: receptores
        };
        this.videollamadasService.setConversacion(conversacion);
        console.log('> Enviando MensajeWebsocket=' + JSON.stringify(contenido));
        this.websocketService.enviarMensajeWebsocket(TipoMensaje.INICIAR_VIDEO_LLAMADA, contenido);
        this.router.navigate(['peticion_videollamada', 'saliente']);
      });

   /* } else {
      console.log('Warning', 'No hay conexion establecida con servicio de videollamadas!!!');
    }*/

  }

  processMensajeWebsocket(mensaje: MensajeWebsocket<any>) {
    console.log('MENSAJE-SERVER=' + JSON.stringify(mensaje));
    switch (mensaje.tipoMensaje) {
        // --- VIDEOLLAMADA_ID_ASIGNADO ---
        case TipoMensaje.VIDEOLLAMADA_ID_ASIGNADO:
          this.videollamadasService.setVideollamadaId(mensaje.contenido);
        break;
        // --- TOKEN_VIDEOLLAMADA ---
        case TipoMensaje.TOKEN_VIDEOLLAMADA:
          console.log('Contenido recibido: ' + JSON.stringify(mensaje.contenido));
          this.videollamadasService.settokenVideollamada(mensaje.contenido.token);
          this.videollamadasService.setVideollamadaId(mensaje.contenido.videollamadaId);
          this.videollamadaEnProceso = true;
          this.conectado = true;
          this.router.navigate(['videollamada/', mensaje.contenido.videollamadaId]);
          break;
        // --- CANCELAR_VIDEOLLAMADA ---
        case TipoMensaje.CANCELAR_LLAMADA:
          this.videollamadaEnProceso = false;
          this.conectado = false;
          this.router.navigate(['home']);
        break;
        // --- TIMEOUT_VIDEOLLAMADA ---
        case TipoMensaje.TIMEOUT_LLAMADA:
          this.videollamadaEnProceso = false;
          this.conectado = false;
          this.router.navigate(['home']);
        break;
        // --- RECHAZAR_VIDEOLLAMADA ---
        case TipoMensaje.RECHAZAR_VIDEOLLAMADA: 
          this.videollamadaEnProceso = false;
          this.conectado = false;
          this.router.navigate(['home']);
        break;
        // --- Un usuario solicita una video llamada ---
        case TipoMensaje.SOLICITUD_VIDEO_LLAMADA:
        this.saliente = false;
        const idConversacion = mensaje.contenido.conversacionId;
        this.conversacionService.readById(idConversacion)
        .subscribe(conversacion => {
          this.videollamadasService.setConversacion(conversacion);
          this.videollamadasService.setMensajeVideollamada(mensaje.contenido);
          this.router.navigate(['peticion_videollamada', 'entrante']);
        });
        break;
        // --- Actualizacion de contactos ---
        case TipoMensaje.ACTUALIZAR_CONTACTOS:
          this.contactos$.subscribe(contactos => this.contactos = contactos);
        break;
        // --- actualizacion de conversaciones ---
        case TipoMensaje.ACTUALIZAR_CONVERSACIONES:
          const conversacionNueva: Conversacion = mensaje.contenido;
          console.log('Notificacion conversacion creada = ' + JSON.stringify(mensaje.contenido));
          conversacionNueva.vistaPrevia = this.crearVistaPreviaMensajes(conversacionNueva);
          conversacionNueva.mensajes = [];
          if (conversacionNueva.participantes.length > 2) {
            this.conversaciones.push(conversacionNueva);
          }
        break;
        // --- recepcion de nuevo mensaje de chat ---
        case TipoMensaje.MENSAJE_CHAT:
        const nuevoMensaje: MensajeNuevoMensajeChat = mensaje.contenido;
        this.chatService.nuevoMensaje(nuevoMensaje);
        // --- validar usuario distino de app para notificar msg ---
        if (nuevoMensaje.mensajeChat.emisor.id !== this.usuario.usuarioChat.id) {
          // this.notificacionService.successNotify('Nuevo mensaje: ' + nuevoMensaje.mensajeChat.contenido);
          console.log('IMPLEEMNTAR NOTIFICACION!!!!');
        }
        let conversacionEnLista = false;
        for (let x = 0; x < this.conversaciones.length; x++) {
          if (this.conversaciones[x].id === nuevoMensaje.conversacionId) {
            this.conversaciones[x].vistaPrevia = nuevoMensaje.mensajeChat.contenido;
            conversacionEnLista = true;
            break;
          }
        }
        if (!conversacionEnLista) {
          this.conversacionService.readById(nuevoMensaje.conversacionId)
          .subscribe(conv => {
            conv.vistaPrevia = this.crearVistaPreviaMensajes(conv);
            this.conversaciones.push(conv);
          });
        break;
      }
    }
  }

  /**
   * Cambia el subtitulo de las pestañas de la aplicacion.
   */
  segmentChanged(event) {
    if (event.detail.value === 'tabContactos') {
      this.titulo = 'Contactos';
    } else if (event.detail.value === 'tabConversaciones') {
      this.titulo = 'Conversaciones';
    } else if (event.detail.value === 'tabSettings') {
      this.titulo = 'Configuración';
    }
  }

  logout() {
    this.loginService.logoutCckall();
    this.router.navigate(['']);
  }

  crearVistaPreviaMensajes(conversacion: Conversacion): string {
    // console.log('crenado vista previa mensaje');
    if (conversacion.mensajes === undefined) {
      return 'No hay mensajes en esta conversación :(';
    }
    if (conversacion.mensajes === null) {
      return 'No hay mensajes en esta conversación :(';
    }
    if (conversacion.mensajes.length === 0) {
      return 'No hay mensajes en esta conversación :(';
    }
    const msg = conversacion.mensajes[conversacion.mensajes.length - 1];
    return msg.contenido;
  }

}
