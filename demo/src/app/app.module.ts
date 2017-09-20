import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { SERVICES } from "./services/index";
import { SailsModule, SailsOptions } from "ngx-sails-socketio";

const url = "ws://52.36.91.56:8081";
const options: SailsOptions = {
    query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
    reconnection: true,
    autoConnect: false,
    prefix: "/api",
    // timeout: 3000,
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SailsModule.forRoot(url, options)
  ],
  providers: SERVICES,
  bootstrap: [AppComponent]
})
export class AppModule { }
