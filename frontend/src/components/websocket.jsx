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
    console.log("Message recieved in webcsosk, yes", event.data)
    const message = JSON.parse(event.data);
    onMessageReceived(message)
  })
  socket.onerror =((error) => {
    console.error("WebSocket error:", error);
  });
  socket.onclose =( (event) => {
    console.log("WebSocket closed:", event);
  });
  return socket;
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("message", JSON.stringify(message))
     socket.send(JSON.stringify({
      type: "message",
      from: message.From,
      to: message.To,
      message: message.Message,
      date: message.Date
    }));
    console.log("Made it here twice")
  } else {
    console.error("WebSocket is not open. Ready state:", socket.readyState);
  }
}

export default setupWebSocket