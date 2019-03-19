import { ChatPageModule } from './chat/chat.module';
 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VideoRoomPageModule } from './video-room/video-room.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ContactosModule } from './contactos/contactos.module';
import { AuthInterceptor } from './shared/services/auth-interceptor.service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        VideoRoomPageModule,
        ContactosModule,
        ChatPageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {
            provide: RouteReuseStrategy, useClass: IonicRouteStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        AndroidPermissions
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
