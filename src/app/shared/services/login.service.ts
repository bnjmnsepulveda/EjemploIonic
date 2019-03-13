import { Injectable } from '@angular/core';
import { ContactoAgente } from '../../contactos/domain/cckall.domain';
import { ContactoAgenteService } from '../../contactos/services/contacto-agente.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private contactoService: ContactoAgenteService
  ) { }

  loginCckall(nombre: string, clave: string): Observable<boolean> {
    return this.contactoService.readByUsuarioAndClave(nombre, clave)
    .pipe(
      switchMap(contacto => {
        if (contacto !== null ) {
          localStorage.setItem('usuario', JSON.stringify(contacto));
          this.setToken(nombre, clave);
          return of(true);
        }
        return of(false);
      })
    );
  }s

  getUsuario(): ContactoAgente {
    const usuario = localStorage.getItem('usuario');
    return JSON.parse(usuario);
  }

  private setToken(usuario: string, clave: string): void {
    localStorage.setItem('token', 'Basic ' + btoa(usuario + ':' + clave));
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  logoutCckall() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

}
