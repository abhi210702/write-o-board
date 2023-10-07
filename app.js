const express = require('express')
const socket = require('socket.io')

const app = express()

app.use(express.static("public"));

let port = process.env.port || 5000;

let server = app.listen(port, () => {
    console.log("listening to port " + 5500);
})

let io = socket(server);
io.on("connection", (socket) => {
    console.log("connected socket to frontend");

    // received data 
    socket.on("beginPath", (data) => {
        // data from frontend
        // now transfer data to all connected computers
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data)
    })
})