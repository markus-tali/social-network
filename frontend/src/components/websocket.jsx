let socket;

export function setupWebSocket(onMessageReceived) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return; // Prevent setting up a new WebSocket connection if one already exists
  }
  socket = new WebSocket("ws://localhost:8081/ws");

  if(socket.readyState === WebSocket.OPEN){
    socket.send(
      JSON.stringify({
        type: "status",
        status: "online",
      })
    );
  } else{
    console.log("WEbsocket is not ready after opening. Ready state:", socket.readyState)
  
  }; 
  
  socket.onmessage= ((event) => {
    const message = JSON.parse(event.data);
    onMessageReceived(message)
  })
  socket.onerror =((error) => {
    console.error("WebSocket error:", error);
  });
  socket.onclose =( (event) => {
    console.log("WebSocket closed:", event, event.reason, event.code);
  });
  return socket;
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("socket is open")
    console.log("message is: ", message)

    if (message.Type === "acceptFollowRequest"){
      socket.send(JSON.stringify(message))

    } else if (message.Type === "rejectFollowRequest") {
      socket.send(JSON.stringify({
        Type: "rejectFollowRequest",
        From: message.From,
        To: message.To
      }));

    }else if(message.Type === "acceptInviteMessage"){
      socket.send(JSON.stringify({
        Type:"acceptInviteMessage",
        Group_id: message.Group_id,
        To:message.To,
        From: message.From
      }))

    }else if(message.Type === "rejectInviteMessage"){
      socket.send(JSON.stringify({
        Type: "rejectInviteMessage",
        Group_id: message.Group_id,
        To: message.To,
        From: message.From
      }));

    } else if (message.Type === "groupInvitation"){
      console.log("GOT IN INVITAIONREQUEST, here is message: ", message)
      socket.send(JSON.stringify(message))

    }else if (message.Type === "joinGroupRequest"){
      console.log("We're currently in joinGroupRequest", message)
        socket.send(JSON.stringify(message))
        
    }else if (message.Type === "acceptGroupJoin"){
      console.log("We're currently in acceptGroupJoin", message)
        socket.send(JSON.stringify(message))

    }else if (message.Type === "rejectGroupJoin"){
      console.log("We're currently in rejectGroupJoin", message)
        socket.send(JSON.stringify(message))

    }else if (message.Type === "eventCreation"){
      console.log("We're currently in eventCreation", message)
        socket.send(JSON.stringify(message))

    }else if (message.Type === "OKEvent"){
      console.log("We're currently in OKEvent", message)
        socket.send(JSON.stringify(message))

    }
    else if (message.Type === "message"){
      socket.send(JSON.stringify({
        Type: "message",
        From: message.From,
        To: message.To,
        Message: message.Message,
        Date: message.Date
      }));
    }
    else if (message.Type === "groupMessage"){
      console.log("We're currently in groupMessage", message)
        socket.send(JSON.stringify(message))

    }
  } else {
    console.error("WebSocket is not open. Ready state:", socket.readyState);
  }
  return socket
}

export default setupWebSocket