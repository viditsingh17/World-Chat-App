const express = require('express');


//App setup
const PORT = process.env.PORT || 3000;
const INDEX = './index.html';
const app = express();
const server = app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`);
});

app.use((req, res) => res.sendFile(INDEX, { root: __dirname }));
// app.use(express.static(__dirname));

//socket setup
// const io = require('socket.io')(server, {
//     cors: {
//       origin: '*',
//     }
//   });
const io = require('socket.io')(server);
    
const users = {}

//this function is called every time a user loades our website
io.on('connection', socket=>{
    console.log(`Client successfully connected`);
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
});