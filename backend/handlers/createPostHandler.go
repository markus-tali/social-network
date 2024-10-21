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
	if r.Method == "OPTIONS" {
		return
	}
	_, username, err := GetCookies(w, r)
	helpers.CheckError(err)
	fmt.Println("username in createpost:", username)

	// Parse the multipart form data (because of avatar files)
	err = r.ParseMultipartForm(10 << 20) // Limit your file size (e.g., 10MB)
	if err != nil {
		// http.Error(w, "Unable to parse form, file too big", http.StatusBadRequest)
		fmt.Println((err))
		return
	}

	postTitle := r.FormValue("title")
	postText := r.FormValue("content")
	postPrivacy := r.FormValue("privacy")
	fmt.Println(postTitle, postText, postPrivacy)

	//read avatar formvalue
	avatarPath := utils.GetAvatars(username, w, r)

	if avatarPath == "" {
		fmt.Println("No avatar uploaded")
	} else {
		fmt.Println("Avatar uploaded at:", avatarPath)
	}

	fmt.Println("Post title is: ", postTitle, "Post content is: ", postText)
	fmt.Println("username for post", username)

	set.InsertPost(username, postTitle, postText, postPrivacy, avatarPath)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
