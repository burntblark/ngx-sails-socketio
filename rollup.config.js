import typescript from "rollup-plugin-typescript";

export default {
    input: "./src/index.ts",
    external: [
        "@angular/core",
        "socket.io-client",
        "json-object-mapper",
        "sails.io.js"
    ],
    // name: "./dist/ngx-sails-socketio.js",
    output: {
        file: "./dist/ngx-sails-socketio.js",
        format: "es"
    },
    plugins: [
        typescript({
            typescript: require("typescript")
        })
    ]
}