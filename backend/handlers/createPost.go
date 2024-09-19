package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
)

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var postData map[string]string
	_, username, err := GetCookies(w, r)
	helpers.CheckError(err)

	err = json.NewDecoder(r.Body).Decode(&postData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	postTitle := postData["postTitle"]
	postText := postData["postText"]
	postCategory := postData["postCategory"]
	fmt.Printf("Received post input: %v\n", postData)
	set.InsertPost(username, postTitle, postText, postCategory)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
