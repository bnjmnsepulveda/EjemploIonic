import { Component, OnInit, Input } from '@angular/core';
import { UsuarioChat, MensajeChat } from '../../../domain/cckall.domain';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajeComponent implements OnInit {

  @Input()
  usuario: UsuarioChat;
  @Input()
  mensaje: MensajeChat;
  cssMensaje: string;

  constructor() { }

  ngOnInit() {
    if (this.mensaje.emisor.id === this.usuario.id) {
      this.cssMensaje = 'usuario';
    } else {
      this.cssMensaje = 'contraparte';
    }
  }

}
