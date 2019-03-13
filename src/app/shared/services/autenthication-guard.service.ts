import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    private router: Router,
    private sesionService: LoginService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
   Observable<boolean> | Promise<boolean> | boolean {
     const user = this.sesionService.getUsuario();
     if (user) {
      return true;
     }
     console.log('redireccionando a inicio');
     this.router.navigate(['']);
     return false;
  }
}