package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
)

func GetNotificationHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var requestData struct {
		MyUsername string `json:"username"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("MY MY YOU GOT IN HERE ", requestData.MyUsername)

	notifications, err := get.GetAllNotification(requestData.MyUsername)
	helpers.CheckError(err)

	fmt.Println("here are the notifications!: ", notifications)

	jsonNotifications, err := json.Marshal(notifications)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}
	w.Write(jsonNotifications)
}
