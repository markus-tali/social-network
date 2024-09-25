package handlers

import (
	"fmt"
	"net/http"

	"main.go/backend/database/set"
	"main.go/backend/helpers"
)

func CreateCommentHandler(w http.ResponseWriter, r *http.Request) {

	CorsEnabler(w, r)

	_, username, err := GetCookies(w, r)
	if err != nil {
		helpers.CheckError(err)
	}
	fmt.Println("username string is here:", username)

	// Parse the multipart form data (because of avatar files)
	err = r.ParseMultipartForm(10 << 20) // Limit your file size (e.g., 10MB)
	if err != nil {
		// http.Error(w, "Unable to parse form, file too big", http.StatusBadRequest)
		fmt.Println((err))
		return
	}

	postId := r.FormValue("postId")
	content := r.FormValue("content")
	fmt.Println("gotem:", content, postId)

	// //read avatar formvalue
	// avatarPath := utils.GetAvatars(username, w, r)

	// if avatarPath == "" {
	// 	fmt.Println("No avatar uploaded")
	// } else {
	// 	fmt.Println("Avatar uploaded at:", avatarPath)
	// }

	fmt.Println("Comment is: ", content)
	set.InsertComment(postId, username, content, "")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Data received successfully"))
}
