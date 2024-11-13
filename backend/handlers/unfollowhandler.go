package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/deletion"
)

func UnfollowHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var userData struct {
		Follower string `json:"follower"`
		Followed string `json:"followed"`
	}

	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		fmt.Println("Error decoding unfollow request:", err)
		return
	}

	err = deletion.RemoveFollowing(userData.Follower, userData.Followed)
	if err != nil {
		http.Error(w, "Failed to unfollow user", http.StatusInternalServerError)
		fmt.Println("Error unfollowing user:", err)
		return
	}

	err = deletion.RemoveNotification("followRequest", userData.Follower, userData.Followed)
	if err != nil {
		http.Error(w, "Failed to delete notification", http.StatusInternalServerError)
		fmt.Println("Error deleting notification:", err)
		return
	}
	fmt.Fprintln(w, "Unfollowed successfully")
	fmt.Println("Unfollow request successful")
}
