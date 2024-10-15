let socket;
export function setupWebSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return; // Prevent setting up a new WebSocket connection if one already exists
  }
  socket = new WebSocket("ws://localhost:8081/ws");
  
  socket.onopen = ((event) => {
    console.log("WebSocket connection opened");
    socket.send(
      JSON.stringify({
        type: "status",
        status: "online",
      })
    );
  }); socket.onerror =((error) => {
    console.error("WebSocket error:", error);
  });
  socket.onclose =( (event) => {
    console.log("WebSocket closed:", event);
  });
  return socket;
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    console.log("Made it here twice")
  } else {
    console.error("WebSocket is not open. Ready state:", socket.readyState);
  }
}

export default setupWebSocket