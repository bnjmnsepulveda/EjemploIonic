import { ContactoAgente } from './../../domain/cckall.domain';
import { ContactoAgenteService } from './../../services/contacto-agente.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { LoginService } from '../../../shared/services/login.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.component.html',
  styleUrls: ['./lista-contactos.component.scss']
})
export class ListaContactosComponent implements OnInit {

  contactos: ContactoAgente[] = [];

  constructor(
    private contactosService: ContactoAgenteService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    const usuario = this.loginService.getUsuario();
    this.contactosService.readAll()
    .pipe(
      map(contactos => contactos.filter(c => c.id !== usuario.id))
    )
    .subscribe( contactos => {
      this.contactos = contactos;
    });
    /*for (let x = 0; x < 10; x++) {
      const c: ContactoAgente = {
        id: x,
        nombre: 'contacto ' + x,
        apellido: ' apellido ',
        enLinea: true,
        usuarioOperkall: 'contacto-'+ x,
        usuarioChat: {
          id: x,
          username: 'user-' + x,
          enLinea: true,
          habilitado: true,
          rol: 'USER'
        }
      };
      this.contactos.push(c);
    }*/
  }

}
