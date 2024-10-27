package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func FollowHandler(w http.ResponseWriter, r *http.Request) {

	var req structs.Follow
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Print("I am FollowHandler error:", err)
		return
	}

	err = set.InsertFollowing(req.FollowerUsername, req.FollowedUsername)
	helpers.CheckError(err)

	fmt.Println("Good job this went through lol")
}
