import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { Conversacion, UsuarioChat } from '../domain/cckall.domain';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { handleEntidadNoEncontrada } from '../../contactos/util/funciones-api';
import * as api from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ConversacionService {

  private endpoint: string = api.WEBSERVICE_VIDEOLLAMADAS;
  private nuevaConversacion: Subject<Conversacion> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

  create(conversacion: Conversacion): Observable<Conversacion> {
    const url = `${this.endpoint}/conversacion`;
    return this.http.post<Conversacion>(url, conversacion, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response'
    }).pipe(
      tap( response => this.nuevaConversacion.next(response.body)),
      switchMap(response => of(response.body))
    );
  }

  readById(id: number): Observable<Conversacion> {
    const url = `${this.endpoint}/conversacion/${id}`;
    const conversacion$ = this.http
    .get<Conversacion>(url)
    .pipe(
      catchError( handleEntidadNoEncontrada )
    );
    return conversacion$;
  }

  readAll(): Observable<Conversacion[]> {
    return this.http.get<Conversacion[]>(`${this.endpoint}/conversacion`);
  }

  readByUsuario(idusuario: number): Observable<Conversacion[]> {
    return this.http.get<Conversacion[]>(`${this.endpoint}/conversacion/usuario/${idusuario}`);
  }

  readByParticipantes(participantes: UsuarioChat[]): Observable<Conversacion> {
    const url = `${this.endpoint}/conversacion/`;
    let params = new HttpParams();
    participantes.forEach(
      usuario => params = params.append('usuarioId', usuario.id + '')
    );
    const conversacion$ = this.http
    .get<Conversacion>(url, { params: params })
    .pipe(
      catchError( handleEntidadNoEncontrada )
    );
    return conversacion$;
  }

  getNuevaConversacion$(): Observable<Conversacion> {
    return this.nuevaConversacion.asObservable();
  }
}
