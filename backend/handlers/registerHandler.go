package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/structs"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var inputData structs.User
	err := json.NewDecoder(r.Body).Decode(&inputData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("Received input: ", inputData)
	dateofBirth := inputData.DateofBirth
	username := inputData.Username
	password := inputData.Password
	firstname := inputData.FirstName
	lastname := inputData.LastName
	email := inputData.Email
	aboutMe := inputData.AboutMe
	nickName := inputData.Nickname
	avatar := inputData.Avatar

	fmt.Println("Received inputdata", dateofBirth, username, password, firstname, lastname, email, aboutMe, nickName, avatar)
	// Send a response back to the client

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
