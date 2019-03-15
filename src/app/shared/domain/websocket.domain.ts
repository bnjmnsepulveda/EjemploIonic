import { ContactoAgente, MensajeChat } from './cckall.domain';

/**
 * Mensaje estandar que se acepata en el servicio de websocket,
 * el contenido cambia segun las necesidades.
 */
export class MensajeWebsocket<T> {
    fecha: Date;
    tipoMensaje: TipoMensaje;
    contenido: T;
}

/**
 * Tipo de mensajes que acepta y recibe el servidor.
 */
export enum TipoMensaje {
    INICIAR_VIDEO_LLAMADA = 'INICIAR_VIDEO_LLAMADA',
    SOLICITUD_VIDEO_LLAMADA = 'SOLICITUD_VIDEO_LLAMADA',
    VIDEOLLAMADA_ID_ASIGNADO = 'VIDEOLLAMADA_ID_ASIGNADO',
    REGISTRO_USUARIO = 'REGISTRO_USUARIO',
    SOLICITUD_CANCELAR_LLAMADA = 'SOLICITUD_CANCELAR_LLAMADA',
    CANCELAR_LLAMADA = 'CANCELAR_LLAMADA',
    RECHAZAR_VIDEOLLAMADA = 'RECHAZAR_VIDEOLLAMADA',
    TIMEOUT_LLAMADA = 'TIMEOUT_LLAMADA',
    CONTESTAR_LLAMADA = 'CONTESTAR_LLAMADA',
    ESTABLECER_LLAMADA = 'ESTABLECER_LLAMADA',
    TERMINAR_VIDEOLLAMADA = 'TERMINAR_VIDEOLLAMADA',
    TOKEN_VIDEOLLAMADA = 'TOKEN_VIDEOLLAMADA',
    ERROR_SERVIDOR = 'ERROR_SERVIDOR',
    ERROR_VIDEOLLAMADA = 'ERROR_VIDEOLLAMADA',
    ACTUALIZAR_CONTACTOS = 'ACTUALIZAR_CONTACTOS',
    MENSAJE_CHAT = 'MENSAJE_CHAT',
    MENSAJE_ESCRIBIENDO = 'MENSAJE_ESCRIBIENDO',
    MENSAJE_INICIO_ESCRIBIENDO = 'MENSAJE_INICIO_ESCRIBIENDO',
    MENSAJE_FIN_ESCRIBIENDO = 'MENSAJE_FIN_ESCRIBIENDO',
    ACTUALIZAR_CONVERSACIONES = 'ACTUALIZAR_CONVERSACIONES'
}

/**
 * Representa el tipo de MensajeWebsocket y su contenido.
 */
export interface ContenidoMensaje {
    tipoMensaje: TipoMensaje;
    contenido: any;
}

// -------- MENSAJES ASOCIADOS A CONTENIDO DE APP -------
/**
 * Mensaje enviado al crear una videollamada.
 */
export interface MensajeVideoLLamada {
    videollamadaId?: string;
    conversacionId: number;
    emisor: ContactoAgente;
    receptores: ContactoAgente[];
}

/**
 * Mensaje recibido al crear una videollamada.
 */
export class MensajeSesionVideoLLamada {
    token: string;
    videollamadaId: string;
    conversacionId: number;
}

/**
 * Representa un mensaje de chat nuevo y su respectiva conversacion id asociado.
 */
export interface MensajeNuevoMensajeChat {
    conversacionId: number;
    mensajeChat: MensajeChat;
}
