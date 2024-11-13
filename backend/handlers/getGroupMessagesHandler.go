package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
)

func GetGroupMessagesHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var reqData struct {
		GroupId int `json:"Group_id"`
	}

	err := json.NewDecoder(r.Body).Decode(&reqData)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("the group: ", reqData.GroupId)

	messages, err := get.GetAllGroupMessages(reqData.GroupId)
	helpers.CheckError(err)

	fmt.Println(messages)

	jsonMessages, err := json.Marshal(messages)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}
	w.Write(jsonMessages)
}
