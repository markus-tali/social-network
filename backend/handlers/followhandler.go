package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
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

	fmt.Println("userdata is lolol: ", userData)

	err = set.InsertFollowing(userData.Follower, userData.Followed)
	helpers.CheckError(err)

	fmt.Println("Good job this went through lol")
}
