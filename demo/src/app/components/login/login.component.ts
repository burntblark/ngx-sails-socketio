import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Sails } from "ngx-sails-socketio";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    constructor(private router: Router, private sails: Sails) {}

    ngOnInit() {}

    onLogin(e: Event) {
        e.preventDefault();
        // tslint:disable-next-line:max-line-length
        const token =
            "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6IkJhYmF0dW5kZXgiLCJsYXN0bmFtZSI6IkZhbWlsdXNpIiwiZW1haWwiOiJ0ZmFtaWx1c2lAeWFob28uY29tIiwiY2FsbGluZ0NvZGUiOiIrMjM0IiwicGhvbmUiOiI4MTg2MDc3NTI3Iiwic3RhdHVzIjoiZGlzYWJsZWQiLCJjcmVhdGVkQXQiOiIyMDE3LTA4LTExVDE0OjEwOjQyLjEzOVoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA4LTE5VDEzOjE3OjQwLjM2NVoiLCJpZCI6IjU5OGRiYWUyZTA1Y2ZlZWYxZDBhZmI5MSIsImlkZW50aXR5IjoiY3VzdG9tZXIiLCJmdWxsbmFtZSI6IkJhYmF0dW5kZXggRmFtaWx1c2kifSwiaWF0IjoxNTAzMjI1OTEzLCJleHAiOjE1MzQ3NjE5MTMsImF1ZCI6IkZpeGVyc2h1YiIsImlzcyI6IlRvbml0b24ifQ.V_nb3F9aYfnaOMyCphuX-DYBNU2H64uHjtUhWM4S_2Q";

        setTimeout(() => {
            localStorage.setItem("token", token);
            this.router.navigateByUrl("/");
        }, 1000);
    }
}
