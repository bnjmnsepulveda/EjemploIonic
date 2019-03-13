import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListaContactosComponent } from './components/lista-contactos/lista-contactos.component';

const routes: Routes = [
  {
    path: '',
    component: ListaContactosComponent
  }
];

@NgModule({
  declarations: [ListaContactosComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class ContactosModule { }
