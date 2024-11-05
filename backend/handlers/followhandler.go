package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"main.go/backend/database/get"
	"main.go/backend/database/set"
	"main.go/backend/structs"
)

func FollowHandler(w http.ResponseWriter, r *http.Request) {
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
		fmt.Print("I am FollowHandler error:", err)
		return
	}

	// fmt.Println("userdata is lolol: ", userData)

	isPrivate, err := get.GetUserPrivacy(userData.Followed)
	if err != nil {
		fmt.Println("in isprivate lol:", err)
		return
	}

	if isPrivate {
		// Private - Lisa `pending` staatuses follow ja teavitus
		err = set.InsertFollowing(userData.Follower, userData.Followed, "pending")
		if err != nil {
			fmt.Println("Cant send notification!")
			return
		}
		fmt.Fprintf(w, "Follow request sent")

		// Broadcast follow request message
		followRequest := structs.SMessage{
			Type: "followRequest",
			From: userData.Follower,
			To:   userData.Followed,
			Date: time.Now().Format("2006-01-02 15:04:05"),
		}
		broadcast <- followRequest

		fmt.Fprintf(w, "Follow request sent")
	} else {
		// Public - Lisa `accepted` staatuses follow
		err = set.InsertFollowing(userData.Follower, userData.Followed, "accepted")
		if err != nil {
			http.Error(w, "Failed to follow user", http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(w, "Follow successful")
	}
}
