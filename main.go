package main

import (
	"fmt"
	"log"
	"net/http"

	"main.go/backend/handlers"
	"main.go/backend/utils"
)

func main() {
	http.HandleFunc("/ws", handlers.WsHandler)
	http.HandleFunc("/register", handlers.RegisterHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	http.HandleFunc("/logout", handlers.LogoutHandler)
	http.HandleFunc("/session", handlers.SessionHandler)
	http.HandleFunc("/createpost", handlers.CreatePostHandler)
	http.HandleFunc("/utils/avatar/", utils.ServeAvatar)

	fmt.Println("Backend server is running")

	log.Fatal(http.ListenAndServe(":8081", nil))
}
