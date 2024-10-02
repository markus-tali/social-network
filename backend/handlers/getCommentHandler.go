package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetCommentHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	comments, err := get.GetAllComments()
	helpers.CheckError(err)
	if comments == nil {
		comments = []structs.Comment{}
	}
	jsonData, err := json.Marshal(comments)
	if err != nil {
		fmt.Println("Error marshaling callback in GetAllPostsHandler")
	}
	w.Write(jsonData)
}
