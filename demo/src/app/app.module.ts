import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import {
    SailsEnvironment,
    SailsModule,
    SailsOptions
} from "ngx-sails-socketio";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { INTERCEPTORS } from "./interceptors";
import { SERVICES } from "./services/index";

const options: SailsOptions = {
    url: "ws://52.36.91.56:8081",
    prefix: "/api",
    environment: SailsEnvironment.DEV,
    query:
        "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
    reconnection: true,
    autoConnect: false
    // headers: {
    //     // tslint:disable-next-line:max-line-length
    //     Authorization: localStorage.getItem("token")
    // },
    // timeout: 3000,
};

@NgModule({
    declarations: [AppComponent, DashboardComponent, LoginComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            { path: "", component: DashboardComponent, pathMatch: "full" },
            { path: "login", component: LoginComponent }
        ]),
        SailsModule.forRoot(options, INTERCEPTORS)
    ],
    providers: SERVICES,
    // providers: [...SERVICES, ...INTERCEPTORS],
    bootstrap: [AppComponent]
})
export class AppModule {}
