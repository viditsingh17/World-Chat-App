$('document').ready(()=>{
    //we call the current client as the 'user' and the other client as 'bot'
    //Global variables
    var outputArea = $('#chat-output');
    var user_message = '';
    //function definitions here
    function getCurrentTime(){
      const date = new Date($.now());
      var hr = date.getHours();
      const min = date.getMinutes();
      var meridian = '';
      if(hr>12){
        hr = hr-12;
        meridian = 'PM';
      }
      else{
        meridian = 'AM';
      }

      const time = hr + ':' + min + ' ' + meridian;
      return time;
    }
    function addBotMessage(message, name, time){
        outputArea.append(`
        <div class='user-message'>
          <div class='message'>
            <div class='name'>${name}</div>
            ${message}
            <div class='time'>${time}</div>
          </div>
        </div>
        `);
      }

    function addUserMessage(message, name, time){
      outputArea.append(`
          <div class='bot-message'>
            <div class='message'>
              <div class='name'>${name}</div>
              ${message}
              <div class='time'>${time}</div>
            </div>
          </div>
        `);
    }

    // Code starts here
    // const socket = io('http://localhost:3000');
    const socket = io.connect();
    const name = prompt('Name yourself?');
    socket.emit('new-user', name);
    outputArea.append(
      `
      <div class="user-connected">You joined</div>
      `
    );
    socket.on('welcome-message', welcome_message=>{
      outputArea.append(
        `
        <div class="welcome-message">${welcome_message}</div>
        `
      );
    });
    socket.on('user-connected', user=>{
      outputArea.append(
        `
        <div class="user-connected">${user} joined</div>
        `
      );
    });
    socket.on('user-disconnected', user=>{
      outputArea.append(
        `
        <div class="user-disconnected">${user} left</div>
        `
      );
    });
    socket.on('chat-message', data=>{
        addBotMessage(data.message, data.name, data.time);
    });


    $('#user-input-form').on("submit", function(e){
        user_message = $('#user-input').val();
        const time = getCurrentTime();
        //If the string trims falsely that means it's either empty or contains only spaces
        if(user_message!=' '){
            const data = {
              message : user_message,
              time : time,
              name : name,
            }
            socket.emit('send-chat-message', data);
            addUserMessage(user_message, 'You', time);
        }
        else{
            alert('Type something!');
        }
        $('#user-input').val('');
    });
});