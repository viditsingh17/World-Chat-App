$('document').ready(()=>{
    //we call the current client as the 'user' and the other client as 'bot'
    //Global variables
    var outputArea = $('#chat-output');
    var user_message = '';
    //function definitions here
    function addBotMessage(message){
        outputArea.append(`
          <div class='user-message'>
            <div class='message'>
              ${message}
            </div>
          </div>
        `);
      }

    function addUserMessage(message){
      const bot_message = $('<div>');
      bot_message.addClass('bot-message').append(` <div class='message'>
            ${message}
          </div>`);
      outputArea.append(bot_message);
    
      $('html, body').animate({
        scrollTop: $('bot-message').offset.top + $('bot-message').scrollHeight
      }, 2000);
    }

    // Code starts here
    const socket = io('http://localhost:3000');
    // const name = prompt('Name yourself?');
    // socket.emit('new-user', name);
    // outputArea.append(
    //   `
    //   <div class="user-connected">You joined</div>
    //   `
    // );
    // socket.on('welcome-message', welcome_message=>{
    //   outputArea.append(
    //     `
    //     <div class="welcome-message">${welcome_message}</div>
    //     `
    //   );
    // });
    // socket.on('user-connected', user=>{
    //   outputArea.append(
    //     `
    //     <div class="user-connected">${user} joined</div>
    //     `
    //   );
    // });
    socket.on('chat-message', message=>{
        console.log(message);
        addBotMessage(message);
    });


    $('#user-input-form').on("submit", function(e){
        user_message = $('#user-input').val();
        //If the string trims falsely that means it's either empty or contains only spaces
        if(user_message!=' '){
            socket.emit('send-chat-message', user_message);
            addUserMessage(user_message);
        }
        else{
            alert('Type something!');
        }
        $('#user-input').val('');
    });
});