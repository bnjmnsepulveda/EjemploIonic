import { of } from 'rxjs';

/**
 * Devuelve un Observable con un objeto en null representando una entidad no encontrada
 * deducido de status = 404.
 */
export function handleEntidadNoEncontrada(err) {
  if (err.status === 404) {
    return of(null);
  }
  throw err;
}
