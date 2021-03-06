import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHeaderService } from './services/resolvers/auth-header.service';
import { MainResolverService } from './services/resolvers/main-resolver.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgPluralizeModule } from 'ng-pluralize';

const mainResolverFactory = (provider: MainResolverService) => () => provider.init();

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        NgPluralizeModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderService, multi: true },
        { provide: APP_INITIALIZER, useFactory: mainResolverFactory, deps: [MainResolverService], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
