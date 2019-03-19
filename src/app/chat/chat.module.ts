import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChatPage } from './chat.page';
import { BarraMensajeComponent } from './components/barra-mensaje/barra-mensaje.component';
import { MensajeComponent } from './components/mensaje/mensaje.component';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChatPage, BarraMensajeComponent, MensajeComponent]
})
export class ChatPageModule {}
