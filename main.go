package main

import (
	"fmt"
	"log"
	"net/http"

	"main.go/backend/handlers"
	"main.go/backend/utils"
)

func main() {
	http.HandleFunc("/ws", handlers.WsHandler)
	http.HandleFunc("/register", handlers.RegisterHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	http.HandleFunc("/logout", handlers.LogoutHandler)
	http.HandleFunc("/session", handlers.SessionHandler)
	http.HandleFunc("/createpost", handlers.CreatePostHandler)
	http.HandleFunc("/createcomment", handlers.CreateCommentHandler)
	http.HandleFunc("/getcomments", handlers.GetCommentHandler)
	http.HandleFunc("/getposts", handlers.GetPostsHandler)
	http.HandleFunc("/getusers", handlers.GetUsersHandler)
	http.HandleFunc("/getmessages", handlers.GetMessagesHandler)
	http.HandleFunc("/utils/avatar/", utils.ServeAvatar)
	http.HandleFunc("/getselecteduser", handlers.GetSelectedUserHandler)
	http.HandleFunc("/toggleuserprivacy", handlers.ToggleUserPrivacyHandler)
	http.HandleFunc("/follow", handlers.FollowHandler)
	http.HandleFunc("/unfollow", handlers.UnfollowHandler)

	fmt.Println("Backend server is running")

	log.Fatal(http.ListenAndServe(":8081", nil))
}
