package handlers

import (
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
	_, username, err := GetCookies(w, r)
	helpers.CheckError(err)

	// Parse the multipart form data (because of avatar files)
	err = r.ParseMultipartForm(10 << 20) // Limit your file size (e.g., 10MB)
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}
	postTitle := r.FormValue("title")
	postText := r.FormValue("content")
	///postAvatar := r.FormFile("avatar")

	set.InsertPost(username, postTitle, postText)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
