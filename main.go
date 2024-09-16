package main

import (
	"fmt"
	"log"
	"net/http"

	"main.go/backend/handlers"
)

func main() {
	http.HandleFunc("/register", handlers.RegisterHandler)
	fmt.Println("Server is running on http://localhost:8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
