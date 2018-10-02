document.addEventListener('DOMContentLoaded', () => {
  const endPoint = 'http://localhost:3000/api/v1/messages';
  const myWebSocket = new WebSocket('ws://localhost:3000/cable');

  myWebSocket.onopen = (event) => {
  const subscribeUserMessage = {"command": "subscribe", "identifier": "{\"channel\":\"ChatChannel\"}"}
  myWebSocket.send(JSON.stringify(subscribeUserMessage));
  console.log("WebSocket is open now.");
  };

  let readyState = myWebSocket.readyState;
  console.log(readyState);

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
