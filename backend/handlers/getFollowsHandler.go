package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetFollowsHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	type ResponseData struct {
		Follows []structs.Follow `json:"follows"`
	}

	_, username, err := GetCookies(w, r)
	fmt.Println("this is udername in getfollowshandler:", username)
	helpers.CheckError(err)

	follows, err := get.GetFollows(username)
	if err != nil {
		http.Error(w, "Failed to get follows", http.StatusInternalServerError)
		return
	}
	responseData := ResponseData{
		Follows: follows,
	}

	jsonFollows, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}
	w.Write(jsonFollows)
}
