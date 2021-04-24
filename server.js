const io = require('socket.io')(3000, {
    cors: {
      origin: "*",
    },
});

const users = {}

//this function is called every time a user loades our website
io.on('connection', socket=>{
    socket.emit('welcome-message', 'Welcome, your journey with Real Time Chat App starts here!');
    socket.on('new-user', name=>{
        name==null?name='Barak Obama[Real]':name=name;
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('send-chat-message', data=>{
        socket.broadcast.emit('chat-message',data);
    });
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
})