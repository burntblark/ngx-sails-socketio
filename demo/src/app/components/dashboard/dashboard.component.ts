import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sails } from "ngx-sails-socketio";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit {

    constructor(private router: Router, private sails: Sails) { }

    ngOnInit() { }

    onLogout(e: Event) {
        e.preventDefault();

        setTimeout(() => {
            localStorage.clear();
            this.sails.removeHeader("Authorize");
            this.router.navigateByUrl("/login");
        }, 2000);
    }

}
