package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
)

func GetMessagesHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var reqData struct {
		ToUser string `json:"toUser"`
		// Limit  int    `json:"limit"`
		// Offset int    `json:"offset"`
	}

	err := json.NewDecoder(r.Body).Decode(&reqData)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("the other user: ", reqData.ToUser)
	_, fromUser, err := GetCookies(w, r)
	helpers.CheckError(err)

	messages, err := get.GetAllMessages(fromUser, reqData.ToUser)
	helpers.CheckError(err)

	fmt.Println(messages)

	jsonMessages, err := json.Marshal(messages)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}
	w.Write(jsonMessages)
}
