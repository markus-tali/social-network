package handlers

import (
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
	"main.go/backend/utils"
)

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {

	CorsEnabler(w, r)

	_, username, err := GetCookies(w, r)
	helpers.CheckError(err)

	// Parse the multipart form data (because of avatar files)
	err = r.ParseMultipartForm(10 << 20) // Limit your file size (e.g., 10MB)
	if err != nil {
		// http.Error(w, "Unable to parse form, file too big", http.StatusBadRequest)
		fmt.Println((err))
		return
	}

	postTitle := r.FormValue("title")
	postText := r.FormValue("content")
	fmt.Println(postTitle, postText)

	//read avatar formvalue
	avatarPath := utils.GetAvatars(username, w, r)

	if avatarPath == "" {
		fmt.Println("No avatar uploaded")
	} else {
		fmt.Println("Avatar uploaded at:", avatarPath)
	}

	fmt.Println("Post title is: ", postTitle, "Post content is: ", postText)
	fmt.Println("username for post", username)

	set.InsertPost(username, postTitle, postText, avatarPath)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
