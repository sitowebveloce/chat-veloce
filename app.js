// Requirement
const { Socket } = require('dgram');
const express = require('express');
// Define the app
const app = express();
const http = require('http');
const { disconnect } = require('process');
const httpServer = http.createServer(app);
// SOCKET IO
const io = require('socket.io')(httpServer);

// Set view engine and static public folder
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.render('index.ejs', {
        room: 'home'
    });
});

// ROOMS
app.get('/:room', (req, res) => {
    let room = req.params.room;
    // console.log(room);
    // Render 
    res.render('index.ejs', {
        room: room
    });
});

//
// ─── SOCKET IO ──────────────────────────────────────────────────────────────────
// ON CONNECTION EVENT
io.on('connection', (socket) => {
    // define user id
    let id = socket.id;
    console.log(`User ${id} connected.`);
    // ON JOIN EVENT SEND THE ID
    socket.on('join', ({ room }) => {
        // Send current id
        socket.emit('your-id', id)
            // JOIN THE ROOM
        socket.join(room);
        // Send broadcast(all except me) message id to this room
        socket.to(room).broadcast.emit('user-join', id);
        // On message event send message to all
        socket.on('message-out', msg => {
            socket.to(room).broadcast.emit('message-in', msg);
        });
        // ON SAYS OUT
        socket.on('says-out', msg => {
            socket.to(room).broadcast.emit('says-in', msg)
        });
        // ON ALREADY IN
        socket.on('user-in-out', msg => {
            socket.to(room).broadcast.emit('user-in-in', msg);
        });
        // ON REPLY
        socket.on('reply-out', msg => {
            socket.to(room).broadcast.emit('reply-in', msg);
        });
        // ─── ON DISCONNECT ──────────────────────────────────────────────────────────────
        socket.on('disconnect', () => {
            console.log(`User ${id} disconnected.`);
            socket.to(room).broadcast.emit('user-disconnected', id);
        });

    });

});

//
// ─── SERVER LISTENER ────────────────────────────────────────────────────────────
const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`Server beating 💓 on port: ${PORT}`);
})