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

export class SesionVideoLLamada {
    videollamadaId: string;
    token: string;
    emisor: ContactoAgente;
    receptor: ContactoAgente;
}

export interface UsuarioEscribiendo {
    usuarioId: number;
    texto: string;
}
