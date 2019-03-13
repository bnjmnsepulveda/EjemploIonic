import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactoAgente } from '../domain/cckall.domain';
import { catchError } from 'rxjs/operators';
import { handleEntidadNoEncontrada } from '../util/funciones-api';

@Injectable({
  providedIn: 'root'
})
export class ContactoAgenteService {

  // private endpoint: string = api.WEBSERVICE_VIDEOLLAMADAS;
  private endpoint = 'https://192.168.0.36:5000/api';

  constructor(
    private http: HttpClient
  ) { }

  readById(id: Number): Observable<ContactoAgente> {
    return this.http.get<ContactoAgente>(this.endpoint + '/agente/' + id)
    .pipe(
      catchError( handleEntidadNoEncontrada )
    );
  }

  readByUsuarioId(id: Number): Observable<ContactoAgente> {
    const options = {
      params: new HttpParams().set('idUsuario', `${id}`)
    };
    return this.http.get<ContactoAgente>(this.endpoint + '/agente', options)
    .pipe(
      catchError( handleEntidadNoEncontrada )
    );
  }

  readByUsuarioOperkall(username: string): Observable<ContactoAgente> {
    return this.http.get<ContactoAgente>(this.endpoint + '/agente/usuario-operkall/' + username)
    .pipe(
      catchError( handleEntidadNoEncontrada )
    );
  }

  readByUsuarioAndClave(username: string, password: string): Observable<ContactoAgente> {
    const options = {
      params: new HttpParams().set('usuario', username).set('clave', password)
    };
    return this.http.get<ContactoAgente>(this.endpoint + '/login/cckall', options);
  }

  readAll(): Observable<ContactoAgente[]> {
    return this.http.get<ContactoAgente[]>(this.endpoint + '/agente');
  }
}
