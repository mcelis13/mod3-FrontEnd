document.addEventListener('DOMContentLoaded', () => {
  const endPoint = 'http://localhost:3000/api/v1/messages';
  const myWebSocket = new WebSocket('ws://localhost:3000/cable');
  const userInput = document.querySelector("#new_message");
  const sendButton = document.querySelector("#send");
  const messButton = document.querySelector('#mess');

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
          \"content\":\"${userInput.value}\"
        }`
      };
      console.log(message);
      myWebSocket.send(JSON.stringify(message));
    })
  };

  fetch(endPoint)
    .then(resp => resp.json())
    .then(data => {
      data.forEach(function(message){
        createMessageContainer(message);
      })
    })

    function createMessageContainer(message){
      let p = document.createElement('p');
      p.innerText = message.content;
      let messageBoard = document.querySelector('#messages_container');
      messageBoard.append(p);
    }

   });
