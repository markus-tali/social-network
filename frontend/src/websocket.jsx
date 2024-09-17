let socket;

export function setupWebSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return; // Prevent setting up a new WebSocket connection if one already exists
  }
  socket = new WebSocket("ws://localhost:8081/ws");
  
  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");
    socket.send(
      JSON.stringify({
        type: "status",
        status: "online",
      })
    );
  }); socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed:", event);
  });
  return socket;