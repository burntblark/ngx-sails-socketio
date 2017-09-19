import { Component, OnInit } from "@angular/core";
import { Sails } from "ngx-sails-socketio";
import { JobsService } from "./services/jobs.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  ngOnInit() {
    const url = "ws://52.36.91.56:8081/api/";
    const options: SocketIOClient.ConnectOpts = {
        query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
        secure: false,
        forceNew: true,
        reconnection: true
    };

    const sails = new Sails(url, options);

    // sails.addEventListener("connect", (data) => {
    //   console.log(data);
    // });

    const connect = sails.connect();
    // console.log(connect);

    const jobs = new JobsService(sails);
    console.log(jobs);
  }
}
