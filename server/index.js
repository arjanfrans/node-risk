'use strict';

const debug = require('debug')('risk/server:index');
const SocketServer = require('socket.io');
const PORT = 3000;
const io = new SocketServer();
const Room = require('./Room');

const clients = new Map();
const rooms = new Map();

io.on('connection', socket => {
    let client = null;

    debug('socket connected', { socketId: socket.id });

    socket.on('register', data => {
        client = {
            id: socket.id,
            name: data.name,
            socket: socket,
            inRoom: null
        };

        clients.set(socket.id, client);

        socket.emit('ready', {});

        debug('client registered', client.name)
    });

    socket.on('create', data => {
        try {
            let room = new Room(data.name, client, io);

            rooms.set(room.name, room);

            client.inRoom = room;

            debug('room created', client, room.toJSON());
        } catch (err) {
            socket.emit('error', {
                error: 'error creating room'
            });

            debug('error creating room', err);
        }
    });

    socket.on('room_info', data => {
        let room = rooms.get(data.name);

        if (room) {
            socket.emit('info', room.toJSON());
        }
    });

    socket.on('join', data => {
        try {
            let room = rooms.get(data.name);

            room.join(client);

            debug('client joined room', room, client);
        } catch (err) {
            socket.emit('error', { error: 'error joining room' });

            debug('error joining room', err);
        }
    });

    socket.on('leave', data => {
        if (client.inRoom) {
            debug('client leaving room', client);
            client.inRoom.leave(client);
            client.inRoom = null;
        } else {
            socket.emit('error', {
                error: 'not in room'
            });
        }
    });

    socket.on('start', data => {
        try {
            if (client.inRoom) {
                client.inRoom.start(client);
            } else {
                throw Error('Not in a room');
            }
        } catch (err) {
            socket.emit('error', {
                error: 'error starting game'
            });
        }
    });

    socket.on('disconnect', () => {
        debug('socket disconnected', { sockedId: socket.id });
    });

    socket.on('error', err => {
        console.log(err ? err.stack : err);
    });
});


io.listen(PORT);
debug('server started', PORT);