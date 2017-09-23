import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { SERVICES } from "./services/index";
import { SailsModule, SailsOptions } from "ngx-sails-socketio";
import { INTERCEPTORS } from "./interceptors";

const options: SailsOptions = {
    url: "ws://52.36.91.56:8081",
    prefix: "/api",
    query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
    reconnection: true,
    autoConnect: false,
    headers: {
        Authorization: "Bearer " + "token"
    },
    // timeout: 3000,
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([]),
        SailsModule.forRoot(options, INTERCEPTORS)
    ],
    providers: SERVICES,
    bootstrap: [AppComponent]
})
export class AppModule { }
