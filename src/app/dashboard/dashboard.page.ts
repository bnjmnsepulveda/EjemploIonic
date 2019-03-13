import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../shared/services/login.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    mySessionId: string;
    nombreUsuario: string;
    claveUsuario: string;

    constructor(
        private router: Router,
        private loginService: LoginService
    ) {}

    ngOnInit() {}

    join(): void {
        if (this.mySessionId) {
            this.mySessionId = this.mySessionId.replace(/ +(?= )/g, '');
            if (this.mySessionId !== '' && this.mySessionId !== ' ') {
                console.log(this.mySessionId === ' ');
                this.router.navigate(['/' + this.mySessionId]);
            }
        }
    }

    contactos(): void {
        this.router.navigate(['/contactos']);
    }

    loginCckall() {
        console.log('iniciar login usuario ' + this.nombreUsuario + ' clave '+ this.claveUsuario);
        this.loginService.loginCckall(this.nombreUsuario, this.claveUsuario)
        .subscribe(login => {
            if (login) {
                this.router.navigate(['/home']);
            } else {
                console.log('LOGIN INCORRECTO!!!');
            }
        });
    }
}
