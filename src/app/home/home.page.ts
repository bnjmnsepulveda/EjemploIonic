import { Component, OnInit } from '@angular/core';
import { ContactoAgenteService } from '../contactos/services/contacto-agente.service';
import { LoginService } from '../shared/services/login.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ContactoAgente } from '../shared/domain/cckall.domain';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tabId: string;
  contactos: ContactoAgente[];
  // conversaciones: Conversacion[];

  constructor(
    private contactosService: ContactoAgenteService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.contactosService.readAll()
    .pipe(
      map( contactos => contactos.filter(c => c.id !== this.loginService.getUsuario().id))
    )
    .subscribe(contactos => this.contactos = contactos);
  }

  onChatContacto(contacto: ContactoAgente) {
    console.log('Chat con ' + JSON.stringify(contacto));
  }

  onVideollamadaContacto(contacto: ContactoAgente) {
    console.log('Videollamada con ' + JSON.stringify(contacto));
    this.router.navigate(['peticion_videollamada']);
  }

}
