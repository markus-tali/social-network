package handlers

import (
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
	"main.go/backend/utils"
)

func CreateCommentHandler(w http.ResponseWriter, r *http.Request) {

	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	_, username, err := GetCookies(w, r)
	if err != nil {
		fmt.Println("this is the error:", err)
		helpers.CheckError(err)
	}

	// Parse the multipart form data (because of avatar files)
	err = r.ParseMultipartForm(10 << 20) // Limit your file size (e.g., 10MB)
	if err != nil {
		// http.Error(w, "Unable to parse form, file too big", http.StatusBadRequest)
		fmt.Println((err))
		return
	}

	postId := r.FormValue("postId")
	content := r.FormValue("content")

	// //read avatar formvalue
	avatarPath := utils.GetAvatars(username, w, r)

	set.InsertComment(postId, username, content, avatarPath)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
