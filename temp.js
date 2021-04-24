
$("document").ready(function(){
    //declaring global variables here, sorta
    const baseLink = 'http://127.0.0.1:5000';
    var inMenuMode = false;
    var inputText = "";
    var outputArea = $("#chat-output");
  
    const getData = async (message) =>{
      let bot_message = 'Some error occured';
      let json;
      recieved_menu = [{"title" : "Addition", "call" : "/chatbot_addition" },
                        {"title" : "Subtration", "call" : "/chatbot_subtraction"},
                        {"title" : "Multiplication", "call" : "/chatbot_multiplication"},
                        {"title" : "Division", "call" : "/chatbot_division"},]
  
      // requestOptions.method = 'GET';
      const response = await fetch(baseLink + '/chatbot_contextual/' + message);
      if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        json = await response.json();
        console.log(json);
      } else {
        alert("HTTP-Error: " + response.status);
      }
  
      //adding bot message to the chat
      bot_message = json.message;
  
      // addBotMessage(bot_message);
      addBotMenuMessage(bot_message, recieved_menu);
  }
  
  function addBotMenuMessage(message, recieved_menu){
  
    //created and appended bot-message blob
    var user_message = document.createElement("div")
      user_message.classList.add("user-message")
      var m = document.createElement("div")
      m.setAttribute("class", "message")
      m.textContent = message
      user_message.appendChild(m)
      outputArea.append(user_message)
  
      //create menu
      var user_menu = document.createElement("div")
      user_menu.setAttribute("class", "user-menu")
      user_message.appendChild(user_menu)
  
      var isMenuUsed = false;
      recieved_menu.forEach(element => {
      var menu_item = document.createElement("div")
      menu_item.classList.add("menu-item")
      menu_item.textContent = element["title"]
      
      menu_item.onclick = function(){
        if(!isMenuUsed){
          inMenuMode = true;
  
          addUserMessage(element["title"]);
          addBotMessage("Enter two numbers seperated by space");
  
          $("#user-input-form").on("submit", function(e) {
            e.preventDefault();
            // var text = $("#user-input").val();
            nums = inputText.split(" ");
            var a = parseInt(nums[0]);
            var b = parseInt(nums[1]);
            
            $.post(baseLink + element["call"], {a: a, b:b}, function(res){
              console.log("Request complete! response:", res);
              addBotMessage(res["result"]);
              inMenuMode = false;
            });
          });
          isMenuUsed = true;
        }
      }
      user_menu.appendChild(menu_item)
    });
        
  }
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
  
  
  
  //Sequential logic comes here
  $("#user-input-form").on("submit", function(e) {
    
      e.preventDefault();
      
      //adding user message to the chat
      inputText = $("#user-input").val();
      addUserMessage(inputText)
  
      if(!inMenuMode){
        getData(inputText);
      }
      
      
  
      
      $("#user-input").val("");
    
    });
  });