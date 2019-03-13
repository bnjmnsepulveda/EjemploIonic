import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PeticionVideollamadaPage } from './peticion-videollamada.page';

const routes: Routes = [
  {
    path: '',
    component: PeticionVideollamadaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PeticionVideollamadaPage]
})
export class PeticionVideollamadaPageModule {}
