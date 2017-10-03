import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { SERVICES } from "./services/index";
import { SailsModule, SailsOptions, SailsEnvironment } from "ngx-sails-socketio";
import { INTERCEPTORS } from "./interceptors";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

const options: SailsOptions = {
    url: "ws://52.36.91.56:8081",
    prefix: "/api",
    environment: SailsEnvironment.DEV,
    query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
    reconnection: true,
    autoConnect: false,
    headers: {
        // tslint:disable-next-line:max-line-length
        Authorization: localStorage.getItem("token")
    },
    // timeout: 3000,
};

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            { path: "", component: DashboardComponent, pathMatch: "full" },
            { path: "login", component: LoginComponent },
        ]),
        SailsModule.forRoot(options, INTERCEPTORS)
    ],
    providers: SERVICES,
    bootstrap: [AppComponent]
})
export class AppModule { }
