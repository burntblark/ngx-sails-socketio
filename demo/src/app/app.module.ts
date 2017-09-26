import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { SERVICES } from "./services/index";
import { SailsModule, SailsOptions, SailsEnvironment } from "ngx-sails-socketio";
import { INTERCEPTORS } from "./interceptors";

const options: SailsOptions = {
    url: "ws://52.36.91.56:8081",
    prefix: "/api",
    environment: SailsEnvironment.DEV,
    query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
    reconnection: true,
    autoConnect: false,
    headers: {
        // tslint:disable-next-line:max-line-length
        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6IkJhYmF0dW5kZXgiLCJsYXN0bmFtZSI6IkZhbWlsdXNpIiwiZW1haWwiOiJ0ZmFtaWx1c2lAeWFob28uY29tIiwiY2FsbGluZ0NvZGUiOiIrMjM0IiwicGhvbmUiOiI4MTg2MDc3NTI3Iiwic3RhdHVzIjoiZGlzYWJsZWQiLCJjcmVhdGVkQXQiOiIyMDE3LTA4LTExVDE0OjEwOjQyLjEzOVoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA4LTE5VDEzOjE3OjQwLjM2NVoiLCJpZCI6IjU5OGRiYWUyZTA1Y2ZlZWYxZDBhZmI5MSIsImlkZW50aXR5IjoiY3VzdG9tZXIiLCJmdWxsbmFtZSI6IkJhYmF0dW5kZXggRmFtaWx1c2kifSwiaWF0IjoxNTAzMjI1OTEzLCJleHAiOjE1MzQ3NjE5MTMsImF1ZCI6IkZpeGVyc2h1YiIsImlzcyI6IlRvbml0b24ifQ.V_nb3F9aYfnaOMyCphuX-DYBNU2H64uHjtUhWM4S_2Q"
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
