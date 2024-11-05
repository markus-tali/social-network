package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func AcceptFollowHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var req struct {
		NotificationId int `json:"notificationId"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Println("Invalid request")
		return
	}

}
