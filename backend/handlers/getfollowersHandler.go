package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetFollowersHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("made it to getfollowershandler")
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	type ResponseData struct {
		Followers []structs.Follow `json:"followers"`
	}
	fmt.Println("made it to getfollowershandler")

	_, username, err := GetCookies(w, r)
	fmt.Println("this is udername in getfollowershandler:", username)
	helpers.CheckError(err)

	followers, err := get.GetFollowers(username)
	if err != nil {
		http.Error(w, "Failed to get followers", http.StatusInternalServerError)
		return
	}

	responseData := ResponseData{
		Followers: followers,
	}

	helpers.CheckError(err)

	jsonFollowers, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, "Error marshaling followers to JSON", http.StatusInternalServerError)
		return
	}

	w.Write(jsonFollowers)

}
