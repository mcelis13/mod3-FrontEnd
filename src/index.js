document.addEventListener('DOMContentLoaded', () => {
  const messagesUrl = 'http://localhost:3000/api/v1/messages';
  const sendersUrl = 'http://localhost:3000/api/v1/senders';
  const receiversUrl = 'http://localhost:3000/api/v1/receivers';
  const conversationsUrl = 'http://localhost:3000/api/v1/conversations';

  const myWebSocket = new WebSocket('ws://localhost:3000/cable');
  const userInput = document.querySelector("#new_message");
  const sendButton = document.querySelector("#send");
  const messButton = document.querySelector('#mess');
  //const loginButton = document.createElement('button');
  const loginButton = document.querySelector('#submit_userName');
  const userDiv = document.querySelector('#messages_container');
  const userInputData = document.querySelector('#new_message');
  const rc = document.getElementById('receivers-container');

      loginButton.addEventListener('click', function(e){
          e.preventDefault();
          event.preventDefault();
          let name = document.querySelector('#name').value;
          //console.log(`this is the value ${name}`);
          let userName = document.getElementById('user_name').value;

          fetch(`${sendersUrl}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              user_name: userName
            })

          })
          .then(res => res.json())
          .then(data => {

            userDiv.dataset.sender_id = data.id;
            userInputData.dataset.sender_id = data.id;
          })
          displayRecievers();
        });


        //subscribing user and sending messages through websocket
        myWebSocket.onopen = (event) => {
        const subscribeUserMessage = {"command": "subscribe", "identifier": "{\"channel\":\"ChatChannel\"}"}
          myWebSocket.send(JSON.stringify(subscribeUserMessage));
          sendButton.addEventListener('click', function(event){
            event.preventDefault();
            let message = {
              "command":"message",
              "identifier":"{\"channel\":\"ChatChannel\"}",
              "data":`{
                \"action\":\"onChat\",
                \"content\":\"${userInput.value}\",
                \"conversation_id\":\"${userDiv.dataset.conversation_id}\",
                \"sender_id\":\"${userDiv.dataset.sender_id}\"
              }`
            };
            myWebSocket.send(message);
          })
        };

        sendButton.addEventListener('click', function(event){
          let userName = document.getElementById('user_name').value;
          let messageList = document.createElement('ul');
          let message = document.createElement('li');
          message.innerText = `${userName}: ${userInputData.value}`;
          messageList.append(message);
          userDiv.append(messageList);
        })


  fetch(`${messagesUrl}`)
    .then(resp => resp.json())
    .then(data => {
      data.forEach(function(message){
        createMessageContainer(message);
      })
    })

    function createMessageContainer(message){
      let p = document.createElement('p');
      p.innerText = `${message.sender.user_name} : ${message.content}`;
      let messageBoard = document.querySelector('#messages_container');
      messageBoard.append(p);
    }

function displayRecievers(){
    fetch(`${receiversUrl}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(function(ele){
        console.log(ele)
        let um = document.getElementById('um');
        let li = document.createElement('li')
        let button = document.createElement('button');
        let receiver_id = ele.id;
        let sender_id = userDiv.dataset.sender_id;
        button.addEventListener('click', function(event){
          event.preventDefault();
          fetch(`${conversationsUrl}`, {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      sender_id: sender_id,
                      receiver_id: receiver_id.toString()
                    })
          })
          .then(resp => resp.json())
          .then(resp => {userDiv.dataset.conversation_id = resp.id})
        });
        button.innerText = ele.user_name;
        li.append(button);
        um.append(li);
      })
    });
  }


});
