import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { first, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-barra-mensaje',
  templateUrl: './barra-mensaje.component.html',
  styleUrls: ['./barra-mensaje.component.scss']
})
export class BarraMensajeComponent implements OnInit {

  // --- modelo de app ---
  textoMensaje: string;
  // --- propiedades para logica de envio de evento escribiendo ---
  contadorEscribiendo = 0;
  emitirEventoEscribiendo = false;
  @Output()
  enviarMensaje = new EventEmitter<string>();
  @Output()
  inicioEscribiendo = new EventEmitter<string>();
  @Output()
  finEscribiendo = new EventEmitter<string>();
  // --- EMISION DE EVENTOS ESCRIBIENDO Y FIN DE ESCIBIENDO ---
  subjectInicioEscribiendo = new Subject<string>();
  subjectFinEscribiendo = new Subject<string>();
  @Output()
  adjuntar = new EventEmitter<string>();
  @Output()
  pregrabados = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    this.textoMensaje = '';
    this.subscripcionInicioEscribiendo();
    this.subjectFinEscribiendo
      .asObservable()
      .pipe(debounceTime(800))
      .subscribe(val => {
        this.finEscribiendo.emit(val);
        this.subscripcionInicioEscribiendo();
      });
  }

  onEnviarMensaje() {
    if (this.textoMensaje.length > 0) {
      this.enviarMensaje.emit(this.textoMensaje);
      this.textoMensaje = '';
    }
  }

  onKeyDown(event) {
    // --- tecla Enter ---
    if (event.keyCode === 13) {
      this.onEnviarMensaje();
    }
  }

  onEscribiendo() {
    // --- emicion de eventos a obserbables de estado escribiendo ---
    this.subjectInicioEscribiendo.next(this.textoMensaje);
    this.subjectFinEscribiendo.next(this.textoMensaje);
  }

  onAdjuntar() {}

  onPregrabados() {}

  /**
   * Crea la suscripcion al evento de inicio de escribiendo cuando sea necesario.
   */
  subscripcionInicioEscribiendo() {
    this.subjectInicioEscribiendo
      .asObservable()
      .pipe(
        first() // operador que devuelve el primer elemento y finaliza.
      )
      .subscribe(val => this.inicioEscribiendo.emit(val));
  }
}
