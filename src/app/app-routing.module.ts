import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'videollamada/:roomName', loadChildren: './video-room/video-room.module#VideoRoomPageModule' },
  { path: 'contactos', loadChildren: './contactos/contactos.module#ContactosModule'  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'peticion_videollamada/:tipo',
  loadChildren: './peticion-videollamada/peticion-videollamada.module#PeticionVideollamadaPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
