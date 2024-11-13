package handlers

import (
	"fmt"
	"net/http"
	"strconv"

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

	fmt.Println("this is our username when creating post: ", username)

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
	groupIdStr := r.FormValue("group_id")

	fmt.Println("THIS IS GROUPID WHEN CREATING POST", groupIdStr)

	groupid, _ := strconv.Atoi(groupIdStr)

	//read avatar formvalue
	avatarPath := utils.GetAvatars(username, w, r)

	set.InsertPost(username, postTitle, postText, postPrivacy, avatarPath, groupid)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
