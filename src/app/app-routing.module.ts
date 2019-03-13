import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'room/:roomName', loadChildren: './video-room/video-room.module#VideoRoomPageModule' },
  { path: 'contactos', loadChildren: './contactos/contactos.module#ContactosModule'  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'peticion_videollamada', loadChildren: './peticion-videollamada/peticion-videollamada.module#PeticionVideollamadaPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
