package main

import (
	"fmt"
	"log"
	"net/http"

	"main.go/backend/database/create"
	"main.go/backend/handlers"
)

func main() {
	create.Create()

	http.HandleFunc("/ws", handlers.WsHandler)
	http.HandleFunc("/register", handlers.RegisterHandler)
	http.HandleFunc("/login", handlers.LoginHandler)

	fmt.Println("Backend server is running")

	log.Fatal(http.ListenAndServe(":8081", nil))
}
