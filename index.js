const express = require('express');

//App setup
const PORT = 3000;
const app = express();
const server = app.listen(process.env.PORT || PORT, function(){
    console.log(`listening on ${process.env.PORT}`);
});
//static file
app.use(express.static('.'));

app.get('/',(req, res)=>{
    res.sendFile('./index.html', {root:'RealTimeChatApp'});
});

//socket setup
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
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
});