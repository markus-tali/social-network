package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	posts, err := get.GetAllPosts()
	helpers.CheckError(err)
	if posts == nil {
		posts = []structs.Post{} // Replace `Post` with your actual post struct type
	}
	jsonData, err := json.Marshal(posts)
	if err != nil {
		fmt.Println("Error marshaling callback in GetAllPostsHandler")
	}
	w.Write(jsonData)

}
