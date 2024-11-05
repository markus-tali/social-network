package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetMyPostsHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	var receiveData struct {
		Username string `json:"username"`
	}

	type ResponseData struct {
		Posts []structs.Post `json:"posts"`
	}

	err := json.NewDecoder(r.Body).Decode(&receiveData)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println("Is this correct? : ", receiveData.Username)

	posts, err := get.GetMyPosts(receiveData.Username)
	if err != nil {
		http.Error(w, "Failed to get myposts", http.StatusInternalServerError)
		return
	}
	responseData := ResponseData{
		Posts: posts,
	}
	helpers.CheckError(err)

	jsonPosts, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}

	w.Write(jsonPosts)
}
