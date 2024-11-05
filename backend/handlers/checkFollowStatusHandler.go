package handlers

import (
	"encoding/json"
	"net/http"

	"main.go/backend/database/get"
)

func CheckFollowStatusHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var reqData struct {
		FromUsername string `json:"fromUsername"`
		ToUsername   string `json:"toUsername"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	isFollowing, err := get.CheckFollowStatus(reqData.FromUsername, reqData.ToUsername)
	if err != nil {
		http.Error(w, "Error checking follow status", http.StatusInternalServerError)
		return
	}

	// Send back a JSON response indicating follow status
	json.NewEncoder(w).Encode(map[string]bool{"isFollowing": isFollowing})
}
