# ngx-sails-socketio
[![npm version](https://badge.fury.io/js/ngx-sails-soketio.svg)](https://badge.fury.io/js/ngx-sails-socketio)
[![Build Status](https://travis-ci.org/brandom/ngx-sails.svg?branch=master)](https://travis-ci.org/brandom/ngx-sails-socketio)
[![Coverage Status](https://coveralls.io/repos/github/burntblark/ngx-sails-socketio/badge.svg?branch=master&cacheBuster=1)](https://coveralls.io/github/burntblark/ngx-sails-socketio?branch=master)

An Angular module for connecting to your SailsJs Backend/API through SocketIO.

## Installation

 ```bash
 npm install ngx-sails-socketio
 ```

## Usage

Add `SailsModule` to your application module.

 ```ts
 // Override options to configure connection to your sailsjs backend
 const options: SailsOptions = {
    url: "ws://127.0.0.1:1337",
    prefix: "/api", // Optional uri prefix
    environment: SailsEnvironment.DEV,
    query: "__sails_io_sdk_version=0.11.0&__sails_io_sdk_platform=windows&__sails_io_sdk_language=javascript",
    reconnection: true,
    autoConnect: false
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SailsModule.forRoot(options, INTERCEPTORS)
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
 ```

 Inject the `Sails` into your components/services and instatiate classes specific to your objective.

 ```ts
class ExampleComponent implements OnInit {

  data: any;

  constructor(private sails: SailsClient) { }

  ngOnInit() {
    const req = new SailsRequest(this.sails);
    req.get('/model/action').subscribe(res => {
      this.data = res.data;
    });
  }

}
 ```

## API

### SailsRequest

* get(url: `string`): `Observable<SailsResponse>`
* post(url: `string`, data: `any`): `Observable<SailsResponse>`
* put(url: `string`, data: `any`): `Observable<SailsResponse>`
* patch(url: `string`, body: `any`): `Observable<SailsResponse>`
* delete(url: `string`): `Observable<SailsResponse>`
* on(event: `string`): `Observable<any>`
* off(event: `string`): `Observable<any>`
```
