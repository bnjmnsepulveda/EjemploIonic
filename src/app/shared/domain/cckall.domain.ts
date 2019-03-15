export interface ContactoAgente {
    id: Number;
    nombre: string;
    apellido: string;
    usuarioOperkall: string;
    enLinea: boolean;
    usuarioChat: UsuarioChat;
}

export interface UsuarioChat {
    id: number;
    username: string;
    habilitado: boolean;
    enLinea: boolean;
    rol: string;
}

export interface UsuarioEscribiendo {
    usuarioId: number;
    texto: string;
}

export interface MensajeChat {
    id?: number;
    contenido: string;
    emisor: UsuarioChat;
    fecha: Date;
    tipoMensaje?: string;
    tipoContenido?: string;
}

export interface Conversacion {
    id?: number;
    titulo?: string;
    descripcion?: string;
    vistaPrevia?: string;
    participantes: UsuarioChat[];
    mensajes?: MensajeChat[];
}

export interface FrasePregrabada {
    id?: number;
    nombre: string;
    frase: string;
}

export enum TipoMensajeChat {
    TEXTO = 'TEXTO',
    IMAGEN = 'IMAGEN',
    ARCHIVO = 'ARCHIVO',
    CONTACTO = 'CONTACTO',
    UBICACION = 'UBICACION'
}