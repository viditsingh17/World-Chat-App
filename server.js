const io = require('socket.io')(3000, {
    cors: {
      origin: "*",
    },
});

const users = {}

//this function is called every time a user loades our website
io.on('connection', socket=>{
    socket.emit('welcome-message', 'Welcome, Your journey with Real Time Chat App starts here!');
    // socket.on('new-user', name=>{
    //     users[socket.id] = name;
    //     socket.broadcast.emit('user-connected', name);
    // });
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message',message);
    });
})